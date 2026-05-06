export function SearchBox({ value, isLoading, onChange, onSearch }) {
    return (
        <div className="searchBox">
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") onSearch();
                }}
                placeholder="e.g. WAW123M or Puławska, Warszawa"
            />

            <button onClick={onSearch} disabled={isLoading}>
                {isLoading ? "Building plan..." : "Build pickup plan"}
            </button>
        </div>
    );
}
