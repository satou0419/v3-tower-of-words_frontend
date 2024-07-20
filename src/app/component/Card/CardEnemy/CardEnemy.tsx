import React, { useState } from "react";
import Draggable from "react-draggable";
import "./cardenemy.scss";

interface SimulationWords {
    word: string;
}

interface CardEnemyProps {
    enemy: {
        id: number;
        imagePath: string;
        words: SimulationWords[];
    };
    removeEnemy: (id: number) => void;
}
const CardEnemy: React.FC<CardEnemyProps> = ({
    enemy,
    removeEnemy,
}) => {
    const [showWords, setShowWords] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const toggleWords = () => {
        setShowWords(!showWords);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    return (
        <section className="cardenemy-wrapper">
            <section className="cardenemy-card">
                <section className="cardenemy-main">
                    <section className="cardenemy-banner">
                        <div></div>
                        <button onClick={togglePopup}>change</button>
                    </section>

                    <section className="cardenemy-details">
                        <div className="name">
                            <span>Name</span>
                            <h1>Enemy {enemy.id}</h1>
                        </div>

                        <div className="total">
                            <span>Words held</span>
                            <p>3</p>
                        </div>
                    </section>

                    <section className="cardenemy-control">
                        <button onClick={() => removeEnemy(enemy.id)}>X</button>
                        <button onClick={toggleWords}>{showWords ? "^" : "v"}</button>
                    </section>
                </section>
                {showWords && (
                    <section className="cardenemy-words">
                        <p>drag and drop words here</p>
                    </section>
                )}

                {showPopup && (
                    <Draggable>
                        <div className="cardenemy-popup">
                            <div>
                                <button>Spring</button>
                            </div>
                            <div>
                                <button>Crab</button>
                            </div>
                        </div>
                    </Draggable>
                )}
            </section>
        </section>
    );
}

export default CardEnemy;
