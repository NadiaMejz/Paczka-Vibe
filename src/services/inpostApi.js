import { fetchJson } from "./http";

const INPOST_API_URL = "https://api-global-points.easypack24.net/v1/points";

export async function findLocker(text) {
    const query = text.trim();

    if (query.includes(",")) {
        return findLockerByStreetAndCity(query);
    }

    return findLockerByName(query);
}

async function findLockerByName(lockerName) {
    const normalizedLockerName = lockerName.trim().toUpperCase();

    const url = `${INPOST_API_URL}?country=PL&type=parcel_locker&name=${encodeURIComponent(
        normalizedLockerName
    )}&per_page=10&page=1`;

    const data = await fetchJson(url);
    const locker = data.items?.find((item) => item.status === "Operating");

    if (!locker) {
        throw new Error(
            "No operating locker found. Try exact locker name, e.g. WAW123M, or street with city, e.g. Puławska, Warszawa."
        );
    }

    return locker;
}

async function findLockerByStreetAndCity(text) {
    const parts = text.split(",");
    const street = parts[0].trim().toLowerCase();
    const city = parts[1].trim();

    if (!street || !city) {
        throw new Error("Use this format: street, city. Example: Puławska, Warszawa.");
    }

    const url = `${INPOST_API_URL}?country=PL&type=parcel_locker&city=${encodeURIComponent(
        city
    )}&per_page=100&page=1`;

    const data = await fetchJson(url);
    const locker = data.items?.find((item) => {
        const itemStreet = item.address_details?.street?.toLowerCase() || "";
        const itemAddress = item.address?.line1?.toLowerCase() || "";

        return (
            item.status === "Operating" &&
            (itemStreet.includes(street) || itemAddress.includes(street))
        );
    });

    if (!locker) {
        throw new Error("No operating locker found on this street. Try another street or exact locker name.");
    }

    return locker;
}
