import { formatOpenUntil, studyTypeLabel } from "../utils/places";
import { getLockerAddress } from "../utils/locker";
import { InfoBox } from "./InfoBox";

export function PickupPlan({ plan }) {
    return (
        <div className="planCard">
            <p className="eyebrow">Your pickup plan</p>

            <h2>
                {plan.mood.emoji} {plan.mood.title}
            </h2>

            <p className="planMainText">{plan.mood.planText}</p>

            <PickupLocker locker={plan.locker} />
            <CoffeePlaces plan={plan} />
            <RouteSummary plan={plan} />
            <LateNightPlaces plan={plan} />
            <StudyPlaces plan={plan} />

            <a className="mapsButton" href={plan.mapsLink} target="_blank" rel="noopener noreferrer">
                Open in Google Maps
            </a>
        </div>
    );
}

function PickupLocker({ locker }) {
    return (
        <InfoBox title="📦 Pickup locker">
            <p>
                <strong>InPost {locker.name}</strong>
            </p>
            <p>{getLockerAddress(locker)}</p>
            <p>{locker.location_description || "No extra locker details."}</p>
            <p>Opening hours: {locker.opening_hours || "Unknown"}</p>
        </InfoBox>
    );
}

function CoffeePlaces({ plan }) {
    if (plan.mood.id !== "coffee" && plan.mood.id !== "walk") return null;

    if (!plan.nearbyPlaces || plan.nearbyPlaces.length === 0) {
        return (
            <InfoBox title="☕ No coffee shops found">
                <p>No coffee places were found within 700 meters of this locker.</p>
            </InfoBox>
        );
    }

    return (
        <InfoBox title="☕ Nearby coffee shops from TomTom">
            {plan.nearbyPlaces.map((place) => (
                <div key={place.id} className="nearbyPlace">
                    <p>
                        <strong>{place.poi?.name || "Coffee place"}</strong>
                    </p>
                    <p>{place.address?.freeformAddress || "No address available."}</p>
                    <p>Distance: {Math.round(place.dist)} m</p>
                </div>
            ))}
        </InfoBox>
    );
}

function RouteSummary({ plan }) {
    if (!plan.route) return null;

    return (
        <InfoBox title={plan.mood.id === "walk" ? "🚶🏼‍♀️ Your scenic walk" : "🚗 Route from your location"}>
            <p>Distance: {(plan.route.distanceMeters / 1000).toFixed(1)} km</p>
            <p>
                {plan.mood.id === "walk" ? "Walking time" : "Estimated time"}:{" "}
                {Math.round(plan.route.durationSeconds / 60)} min
            </p>
            {plan.mood.id === "walk" && <p>Approx. {Math.round(plan.route.distanceMeters / 0.75)} steps</p>}
        </InfoBox>
    );
}

function LateNightPlaces({ plan }) {
    if (plan.mood.id !== "late") return null;

    if (!plan.nearbyPlaces || plan.nearbyPlaces.length === 0) {
        return (
            <InfoBox title="🌙 No late-night groceries nearby">
                <p>No grocery shops open late within 1 km of this locker.</p>
            </InfoBox>
        );
    }

    return (
        <InfoBox title="🌙 Late-night groceries near the locker">
            {plan.nearbyPlaces.map((place) => (
                <div key={place.id} className="nearbyPlace">
                    <p>
                        <strong>{place.poi?.name || "Late-night spot"}</strong>
                    </p>
                    <p>{place.poi?.categories?.[0] || ""}</p>
                    <p>{place.address?.freeformAddress || "No address available."}</p>
                    <p>Distance: {Math.round(place.dist)} m</p>
                    <p>{formatOpenUntil(place)}</p>
                </div>
            ))}
        </InfoBox>
    );
}

function StudyPlaces({ plan }) {
    if (plan.mood.id !== "study") return null;

    if (!plan.nearbyPlaces || plan.nearbyPlaces.length === 0) {
        return (
            <InfoBox title="💻 No study spots found">
                <p>No cafés, libraries or co-working spots within 1 km of this locker.</p>
            </InfoBox>
        );
    }

    return (
        <InfoBox title="💻 Study spots near the locker">
            {plan.nearbyPlaces.map((place) => (
                <div key={place.id} className="nearbyPlace">
                    <p>
                        <strong>{place.poi?.name || "Study spot"}</strong>{" "}
                        <span className="studyBadge">{studyTypeLabel(place.studyType)}</span>
                    </p>
                    <p>{place.address?.freeformAddress || "No address available."}</p>
                    <p>Distance: {Math.round(place.dist)} m</p>
                    {place.poi?.openingHours && <p>{formatOpenUntil(place)}</p>}
                </div>
            ))}
        </InfoBox>
    );
}
