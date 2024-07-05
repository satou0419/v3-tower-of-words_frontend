"use client";

import { useState } from "react";
import "./gameplay.scss";
import Button from "@/app/component/Button/Button";

const Gameplay: React.FC = () => {
    const [showGameplayItem, setShowGameplayItem] = useState<boolean>(false);
    const [showGameplayInput, setShowGameplayInput] = useState<boolean>(true);
    const [showGameplayClue, setShowGameplayClue] = useState<boolean>(false);

    const onDisplayGameItem = () => {
        setShowGameplayItem(true);
        setShowGameplayInput(false);
        setShowGameplayClue(false);
    };

    const onDisplayGameInput = () => {
        setShowGameplayInput(true);
        setShowGameplayItem(false);
        setShowGameplayClue(false);
    };

    const onDisplayGameClue = () => {
        setShowGameplayClue(true);
        setShowGameplayInput(false);
        setShowGameplayItem(false);
    };

    return (
        <main className="gameplay-wrapper">
            <section className="gameplay-platform">
                <section className="gameplay-progress-container">
                    <div className="gameplay-progress_indicator">
                        <span>Floor 4</span>
                    </div>
                    <div className="gameplay-progress_floor">
                        <span> Floor Progress: 1/10</span>
                    </div>
                </section>

                <section className="gameplay-character">
                    <section className="gameplay-main">
                        <div className="main-health"></div>
                        <section className="character-image">
                            <div className="main-sprite"></div>
                        </section>
                    </section>
                    <section className="gameplay-enemy">
                        <div className="enemy-health"></div>
                        <section className="character-image">
                            <div className="enemy-sprite"></div>
                        </section>
                    </section>
                </section>
            </section>

            <section className="gameplay-controls">
                <section
                    className="gameplay-item"
                    style={{
                        visibility: showGameplayItem ? "visible" : "hidden",
                    }}
                    onClick={onDisplayGameItem}
                >
                    Item
                </section>
                <form
                    className="gameplay-input"
                    style={{
                        visibility: showGameplayInput ? "visible" : "hidden",
                    }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        onDisplayGameInput();
                    }} // Handle form submission
                >
                    <button type="button">...</button>
                    <input type="text" required autoFocus />
                    <button type="submit">GO!</button>
                </form>

                <section
                    className="gameplay-clue"
                    style={{
                        visibility: showGameplayClue ? "visible" : "hidden",
                    }}
                    onClick={onDisplayGameClue}
                >
                    <span> Word's Info</span>
                    <section className="clue-wrapper">
                        <section className="clue-pronunciation">
                            <span>Pronunciation</span>
                            <div>
                                <span>ha-pe</span>
                            </div>
                        </section>

                        <section className="definition-wrapper">
                            <span>Definition</span>
                            <div>
                                <span>
                                    enjoying or characterized by well-being and
                                    contentment.
                                </span>
                            </div>
                        </section>
                    </section>
                </section>
            </section>
        </main>
    );
};

export default Gameplay;
