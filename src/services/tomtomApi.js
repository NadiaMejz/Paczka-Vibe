import { assertTomTomApiKey, tomtomApiKey } from "../config/env";
import { isOpenLate, isStudyFriendlyCafe } from "../utils/places";
import { fetchJson } from "./http";

export async function findNearbyPlaces(locker, mood) {
    assertTomTomApiKey();

    const lat = locker.location.latitude;
    const lon = locker.location.longitude;
    const radius = 700;
    const limit = 3;

    const query = mood.tomtomQuery || "coffee shop";
    const categorySet = mood.tomtomCategorySet || "9376";

    const url = `https://api.tomtom.com/search/2/categorySearch/${encodeURIComponent(
        query
    )}.json?key=${tomtomApiKey}&lat=${lat}&lon=${lon}&radius=${radius}&limit=${limit}&countrySet=PL&categorySet=${categorySet}`;

    const data = await fetchJson(url);

    return data.results || [];
}

export async function findLateNightPlaces(locker) {
    assertTomTomApiKey();

    const lat = locker.location.latitude;
    const lon = locker.location.longitude;
    const radius = 1000;
    const limit = 20;
    const categorySet = "7332,9361";

    const url = `https://api.tomtom.com/search/2/nearbySearch/.json` +
        `?key=${tomtomApiKey}&lat=${lat}&lon=${lon}&radius=${radius}&limit=${limit}` +
        `&countrySet=PL&categorySet=${categorySet}&openingHours=nextSevenDays`;

    const data = await fetchJson(url);
    const all = data.results || [];

    return all.filter((place) => isOpenLate(place)).slice(0, 5);
}

export async function findStudyPlaces(locker) {
    assertTomTomApiKey();

    const lat = locker.location.latitude;
    const lon = locker.location.longitude;
    const radius = 1000;
    const limit = 10;

    const cafeUrl = `https://api.tomtom.com/search/2/categorySearch/cafe.json` +
        `?key=${tomtomApiKey}&lat=${lat}&lon=${lon}&radius=${radius}&limit=${limit}` +
        `&countrySet=PL&categorySet=9376&openingHours=nextSevenDays`;

    const libraryUrl = `https://api.tomtom.com/search/2/categorySearch/library.json` +
        `?key=${tomtomApiKey}&lat=${lat}&lon=${lon}&radius=${radius}&limit=5` +
        `&countrySet=PL&categorySet=7374&openingHours=nextSevenDays`;

    const coworkUrl = `https://api.tomtom.com/search/2/poiSearch/coworking.json` +
        `?key=${tomtomApiKey}&lat=${lat}&lon=${lon}&radius=${radius}&limit=5` +
        `&countrySet=PL`;

    const [cafes, libraries, coworks] = await Promise.all([
        fetchJson(cafeUrl).then((data) => data.results || []).catch(() => []),
        fetchJson(libraryUrl).then((data) => data.results || []).catch(() => []),
        fetchJson(coworkUrl).then((data) => data.results || []).catch(() => []),
    ]);

    const taggedCafes = cafes
        .filter(isStudyFriendlyCafe)
        .map((place) => ({ ...place, studyType: "cafe" }));

    const taggedLibraries = libraries.map((place) => ({ ...place, studyType: "library" }));
    const taggedCoworks = coworks.map((place) => ({ ...place, studyType: "cowork" }));

    return [...taggedLibraries, ...taggedCoworks, ...taggedCafes]
        .sort((a, b) => (a.dist || 0) - (b.dist || 0))
        .slice(0, 6);
}

export async function fetchRoute(origin, destination, options = {}) {
    assertTomTomApiKey();

    const { travelMode = "car", routeType = "fastest", waypoint = null } = options;
    const start = `${origin.lat},${origin.lon}`;
    const end = `${destination.lat},${destination.lon}`;

    const path = waypoint
        ? `${start}:${waypoint.lat},${waypoint.lon}:${end}`
        : `${start}:${end}`;

    const url = `https://api.tomtom.com/routing/1/calculateRoute/${path}/json` +
        `?key=${tomtomApiKey}&travelMode=${travelMode}&routeType=${routeType}&traffic=true`;

    const data = await fetchJson(url);
    const route = data.routes?.[0];

    if (!route) {
        throw new Error("Could not calculate a route to this locker.");
    }

    const coordinates = route.legs.flatMap((leg) =>
        leg.points.map((point) => [point.longitude, point.latitude])
    );

    return {
        coordinates,
        distanceMeters: route.summary.lengthInMeters,
        durationSeconds: route.summary.travelTimeInSeconds,
    };
}
