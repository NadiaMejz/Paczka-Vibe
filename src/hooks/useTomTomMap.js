import { useEffect, useRef } from "react";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as tt from "@tomtom-international/web-sdk-maps";
import { tomtomApiKey } from "../config/env";
import { getLockerAddress } from "../utils/locker";

const DEFAULT_MAP_CENTER = [21.0122, 52.2297];
const DEFAULT_MAP_ZOOM = 12;

export function useTomTomMap() {
    const mapElementRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!tomtomApiKey) {
            console.error("Missing TomTom API key. Add VITE_TOMTOM_API_KEY to .env.local.");
            return undefined;
        }

        const map = tt.map({
            key: tomtomApiKey,
            container: mapElementRef.current,
            center: DEFAULT_MAP_CENTER,
            zoom: DEFAULT_MAP_ZOOM,
        });

        mapRef.current = map;

        return () => {
            markersRef.current.forEach((marker) => marker.remove());
            markersRef.current = [];
            map.remove();
            mapRef.current = null;
        };
    }, []);

    function showLockerAndPlacesOnMap(locker, places = [], route = null, userLocation = null) {
        const tomtomMap = mapRef.current;
        if (!tomtomMap) return;

        clearMap(tomtomMap, markersRef);

        const lockerLng = Number(locker.location.longitude);
        const lockerLat = Number(locker.location.latitude);
        const lockerLngLat = [lockerLng, lockerLat];

        const lockerMarker = new tt.Marker()
            .setLngLat(lockerLngLat)
            .setPopup(
                new tt.Popup({ offset: 30 }).setHTML(
                    `<strong>InPost ${locker.name}</strong><br/>${getLockerAddress(locker)}`
                )
            )
            .addTo(tomtomMap);
        markersRef.current.push(lockerMarker);

        const bounds = new tt.LngLatBounds();
        bounds.extend(lockerLngLat);

        places.forEach((place) => {
            if (!place.position) return;

            const placeLngLat = [Number(place.position.lon), Number(place.position.lat)];
            const placeMarker = new tt.Marker()
                .setLngLat(placeLngLat)
                .setPopup(
                    new tt.Popup({ offset: 30 }).setHTML(
                        `<strong>${place.poi?.name || "Place"}</strong><br/>${
                            place.address?.freeformAddress || "No address available"
                        }`
                    )
                )
                .addTo(tomtomMap);

            markersRef.current.push(placeMarker);
            bounds.extend(placeLngLat);
        });

        if (userLocation && route) {
            drawUserRoute(tomtomMap, markersRef, route, userLocation, bounds);
        }

        if (places.length === 0 && !route) {
            tomtomMap.flyTo({ center: lockerLngLat, zoom: 15 });
            return;
        }

        tomtomMap.fitBounds(bounds, { padding: 80, maxZoom: 16, duration: 1000 });
    }

    return {
        mapElementRef,
        showLockerAndPlacesOnMap,
    };
}

function clearMap(tomtomMap, markersRef) {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (tomtomMap.getLayer("route-line")) tomtomMap.removeLayer("route-line");
    if (tomtomMap.getSource("route")) tomtomMap.removeSource("route");
}

function drawUserRoute(tomtomMap, markersRef, route, userLocation, bounds) {
    const userLngLat = [userLocation.lon, userLocation.lat];

    const userMarker = new tt.Marker({ color: "#2563eb" })
        .setLngLat(userLngLat)
        .setPopup(new tt.Popup({ offset: 30 }).setHTML("<strong>You are here</strong>"))
        .addTo(tomtomMap);
    markersRef.current.push(userMarker);

    const drawRoute = () => {
        tomtomMap.addSource("route", {
            type: "geojson",
            data: {
                type: "Feature",
                geometry: { type: "LineString", coordinates: route.coordinates },
            },
        });
        tomtomMap.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#2563eb", "line-width": 5 },
        });
    };

    if (tomtomMap.isStyleLoaded()) {
        drawRoute();
    } else {
        tomtomMap.once("load", drawRoute);
    }

    bounds.extend(userLngLat);
    route.coordinates.forEach((coordinate) => bounds.extend(coordinate));
}
