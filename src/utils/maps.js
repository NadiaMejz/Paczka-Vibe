export function createMapsLink(locker, nearbyPlace, userLocation, walkMode = false) {
    const lockerPoint = `${locker.location.latitude},${locker.location.longitude}`;

    if (userLocation && walkMode) {
        const origin = `${userLocation.lat},${userLocation.lon}`;
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${lockerPoint}&travelmode=walking`;
    }

    if (userLocation && !nearbyPlace) {
        const origin = `${userLocation.lat},${userLocation.lon}`;
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${lockerPoint}&travelmode=driving`;
    }

    if (!nearbyPlace) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lockerPoint)}`;
    }

    const destination = getPlaceDestination(nearbyPlace);

    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        lockerPoint
    )}&destination=${encodeURIComponent(destination)}&travelmode=walking`;
}

function getPlaceDestination(place) {
    if (place.position) {
        return `${place.position.lat},${place.position.lon}`;
    }

    return place.address?.freeformAddress || place.poi?.name || "Nearby place";
}
