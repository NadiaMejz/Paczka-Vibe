import { useState } from "react";
import "./App.css";
import { EmptyState } from "./components/EmptyState";
import { HeroSection } from "./components/HeroSection";
import { MapPanel } from "./components/MapPanel";
import { MoodSelector } from "./components/MoodSelector";
import { PickupPlan } from "./components/PickupPlan";
import { SearchBox } from "./components/SearchBox";
import { moods } from "./constants/moods";
import { useTomTomMap } from "./hooks/useTomTomMap";
import { useMotionEffects } from "./hooks/useMotionEffects";
import { getCurrentPosition } from "./services/geolocation";
import { findLocker } from "./services/inpostApi";
import { fetchRoute, findLateNightPlaces, findNearbyPlaces, findStudyPlaces } from "./services/tomtomApi";
import { createMapsLink } from "./utils/maps";
import { computeDetourWaypoint } from "./utils/route";

function App() {
    const [selectedMood, setSelectedMood] = useState("coffee");
    const [searchText, setSearchText] = useState("");
    const [plan, setPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { mapElementRef, showLockerAndPlacesOnMap } = useTomTomMap();
    useMotionEffects();

    const selectedMoodData = moods.find((mood) => mood.id === selectedMood) || moods[0];

    async function handleSearch() {
        const normalizedSearchText = normalizeSearchText(searchText);

        if (!normalizedSearchText) {
            setError("Enter locker name or street with city first.");
            return;
        }

        setSearchText(normalizedSearchText);
        setError("");
        setPlan(null);
        setIsLoading(true);

        try {
            const nextPlan = await buildPickupPlan(normalizedSearchText, selectedMoodData);

            setPlan(nextPlan);
            showLockerAndPlacesOnMap(
                nextPlan.locker,
                nextPlan.nearbyPlaces,
                nextPlan.route,
                nextPlan.userLocation
            );
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="app">
            <HeroSection selectedMood={selectedMoodData} />

            <MoodSelector moods={moods} selectedMoodId={selectedMood} onSelectMood={setSelectedMood} />

            <section className="searchSection">
                <SearchBox
                    value={searchText}
                    isLoading={isLoading}
                    onChange={setSearchText}
                    onSearch={handleSearch}
                />

                {error && <p className="errorText">{error}</p>}
            </section>

            <section className="resultSection">
                <MapPanel mapRef={mapElementRef} />

                {!plan && !isLoading && <EmptyState />}
                {plan && <PickupPlan plan={plan} />}
            </section>
        </main>
    );
}

function normalizeSearchText(text) {
    const trimmedText = text.trim();

    if (trimmedText.includes(",")) {
        return trimmedText;
    }

    return trimmedText.toUpperCase();
}

async function buildPickupPlan(searchText, selectedMoodData) {
    const locker = await findLocker(searchText);

    let nearbyPlaces = [];
    let route = null;
    let userLocation = null;

    if (selectedMoodData.id === "coffee") {
        nearbyPlaces = await findNearbyPlaces(locker, selectedMoodData);
    } else if (selectedMoodData.id === "quick") {
        userLocation = await getCurrentPosition();
        route = await fetchRoute(userLocation, getLockerPoint(locker));
    } else if (selectedMoodData.id === "walk") {
        userLocation = await getCurrentPosition();
        const lockerPoint = getLockerPoint(locker);
        const detour = computeDetourWaypoint(userLocation, lockerPoint, 0.4);

        route = await fetchRoute(userLocation, lockerPoint, {
            travelMode: "pedestrian",
            routeType: "shortest",
            waypoint: detour,
        });

        nearbyPlaces = await findNearbyPlaces(locker, {
            tomtomQuery: "coffee shop",
            tomtomCategorySet: "9376",
        });
    } else if (selectedMoodData.id === "late") {
        nearbyPlaces = await findLateNightPlaces(locker);
    } else if (selectedMoodData.id === "study") {
        nearbyPlaces = await findStudyPlaces(locker);
    }

    const mapsLink = createMapsLink(
        locker,
        nearbyPlaces[0],
        userLocation,
        selectedMoodData.id === "walk"
    );

    return {
        locker,
        mood: selectedMoodData,
        nearbyPlaces,
        route,
        userLocation,
        mapsLink,
    };
}

function getLockerPoint(locker) {
    return {
        lat: Number(locker.location.latitude),
        lon: Number(locker.location.longitude),
    };
}

export default App;
