export function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) =>
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                }),
            (err) => {
                console.error("Geolocation error:", err.code, err.message);
                reject(new Error(`Location error (${err.code}): ${err.message}`));
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}
