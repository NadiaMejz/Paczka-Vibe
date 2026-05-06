export function MoodSelector({ moods, selectedMoodId, onSelectMood }) {
    return (
        <section className="moodSection">
            <p className="eyebrow">Choose mood</p>
            <div className="moodGrid">
                {moods.map((mood) => (
                    <button
                        key={mood.id}
                        className={selectedMoodId === mood.id ? "moodCard active" : "moodCard"}
                        onClick={() => onSelectMood(mood.id)}
                    >
                        <span className="moodEmoji">{mood.emoji}</span>
                        <strong>{mood.title}</strong>
                        <small>{mood.description}</small>
                    </button>
                ))}
            </div>
        </section>
    );
}
