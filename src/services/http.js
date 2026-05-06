export async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("API request failed.");
    }

    return response.json();
}
