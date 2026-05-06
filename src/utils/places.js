export function formatOpenUntil(place) {
    const hours = place.poi?.openingHours?.timeRanges;
    if (!hours || hours.length === 0) return "Hours unknown";

    const todayStr = getLocalDateString(new Date());
    const current = hours.find((range) => {
        const startsToday = range.startTime?.date === todayStr;
        return startsToday || range.endTime?.date >= todayStr;
    });

    if (!current?.endTime) return "Open now";

    const endsLater = current.endTime.date > todayStr;
    if (endsLater) return "Open 24/7 or overnight";

    const hh = String(current.endTime.hour).padStart(2, "0");
    const mm = String(current.endTime.minute).padStart(2, "0");
    return `Open until ${hh}:${mm}`;
}

export function studyTypeLabel(type) {
    if (type === "library") return "📚 Library";
    if (type === "cowork") return "🏢 Co-working";
    return "☕ Café";
}

export function isOpenLate(place) {
    const hours = place.poi?.openingHours?.timeRanges;
    if (!hours || hours.length === 0) return false;

    return hours.some((range) => {
        const startH = range.startTime?.hour ?? 0;
        const endH = range.endTime?.hour ?? 0;
        const startDate = range.startTime?.date;
        const endDate = range.endTime?.date;

        if (endDate && startDate && endDate > startDate) return true;
        if (endH >= 23) return true;
        if (startH < 6 && endH > startH) return true;

        return false;
    });
}

export function isStudyFriendlyCafe(place) {
    const name = (place.poi?.name || "").toLowerCase();
    const blacklist = ["to go", "express", "kiosk", "automat", "drive"];
    if (blacklist.some((word) => name.includes(word))) return false;

    const studyChains = [
        "starbucks",
        "costa",
        "green caffè",
        "green caffe",
        "coffeedesk",
        "etno cafe",
        "mount blanc",
        "so! coffee",
    ];
    if (studyChains.some((chain) => name.includes(chain))) return true;

    const hours = place.poi?.openingHours?.timeRanges;
    return hours && hours.length > 0;
}

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
