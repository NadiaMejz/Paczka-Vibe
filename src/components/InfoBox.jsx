export function InfoBox({ title, children }) {
    return (
        <div className="infoBox">
            <h3>{title}</h3>
            {children}
        </div>
    );
}
