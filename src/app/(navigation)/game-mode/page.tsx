import CardTab from "@/app/component/Card/CardTab/CardTab";
import "./gamemode.scss";

export default function GameMode() {
    return (
        <main className="gamemode-wrapper">
            <section className="gamemode-container">
                <button type="button">Back</button>

                <section className="gamemode-content">
                    <h1>Choose Game Mode</h1>
                    <section className="gamemode-option">
                        <div>Spelling Game</div>
                        <div>Syllable Game</div>
                        <div>Silent Game</div>
                    </section>
                </section>
            </section>
        </main>
    );
}
