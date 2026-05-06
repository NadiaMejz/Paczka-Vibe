export function computeDetourWaypoint(origin, destination, detourFactor = 0.4) {
    const midLat = (origin.lat + destination.lat) / 2;
    const midLon = (origin.lon + destination.lon) / 2;

    const dLat = destination.lat - origin.lat;
    const dLon = destination.lon - origin.lon;

    const latCorrection = Math.cos((midLat * Math.PI) / 180);

    return {
        lat: midLat + dLon * detourFactor * latCorrection,
        lon: midLon - (dLat * detourFactor) / latCorrection,
    };
}
