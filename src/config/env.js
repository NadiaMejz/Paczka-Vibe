export const tomtomApiKey = import.meta.env.VITE_TOMTOM_API_KEY;

export function assertTomTomApiKey() {
    if (!tomtomApiKey) {
        throw new Error("Missing TomTom API key. Add VITE_TOMTOM_API_KEY to .env.local.");
    }
}
