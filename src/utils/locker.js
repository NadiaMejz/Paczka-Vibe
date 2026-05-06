export function getLockerAddress(locker) {
    const street = locker.address?.line1 || "Unknown street";
    const city = locker.address_details?.city || "Unknown city";

    return `${street}, ${city}`;
}
