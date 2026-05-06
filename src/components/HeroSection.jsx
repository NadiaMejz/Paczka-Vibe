export function HeroSection({ selectedMood }) {
    return (
        <section className="hero">
            <div className="heroContent">
                <p className="eyebrow">Paczka Vibe</p>

                <h1>Pick up your parcel without killing the vibe.</h1>

                <p className="heroText">
                    Enter an InPost locker or street, choose your mood, and get a simple pickup plan.
                </p>

            </div>

            <div className="heroCard">
                <div className="heroCardTop">
                    <p className="cardLabel">Today’s vibe</p>
                    <span className="apiBadge">InPost + TomTom</span>
                </div>

                <div className="heroCardMain">
                    <div className="heroEmoji">{selectedMood.emoji}</div>

                    <h2>{selectedMood.title}</h2>

                    <p>{selectedMood.description}</p>
                </div>

                <div className="heroMiniPlan">
                    <div className="miniPlanStep">
                        <span>1</span>
                        <p>Find your locker</p>
                    </div>

                    <div className="miniPlanStep">
                        <span>2</span>
                        <p>Find a place nearby</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
