import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import "./cardenemy.scss";
import useImageParse from "@/hook/useImageParse";
import useFetchAllSimulationWords from "@/hook/useAllSimulationWords";

interface Enemy {
    imagePath: string;
    words: number[];
}

interface CardEnemyProps {
    enemy: Enemy;
    index: number;
    removeEnemy: (id: number) => void;
    updateEnemyWords: (id: number, updatedWords: number[]) => void;
    updateEnemyImagePath: (id: number, imagePath: string) => void;
}

const CardEnemy: React.FC<CardEnemyProps> = ({
    enemy,
    index,
    removeEnemy,
    updateEnemyWords,
    updateEnemyImagePath,
}) => {
    const [showWords, setShowWords] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const name = useImageParse(enemy.imagePath);
    const popupRef = useRef<HTMLDivElement>(null);
    const simulationWords = useFetchAllSimulationWords(enemy.words);

    console.log(simulationWords);

    const toggleWords = () => {
        setShowWords(!showWords);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    function handleOnDrop(e: React.DragEvent) {
        e.preventDefault();

        const word = e.dataTransfer.getData("word");
        const simulationWordsID = parseInt(
            e.dataTransfer.getData("simulationWordsID")
        );

        const idExists = enemy.words.some(
            (wordItem) => wordItem === simulationWordsID
        );

        if (word && !idExists) {
            updateEnemyWords(index, [...enemy.words, simulationWordsID]);
        }
        console.log(word);
        console.log(enemy);
    }

    function handleOnDrag(e: React.DragEvent, wordID: number, enemyID: any) {
        e.dataTransfer.setData("wordID", wordID.toString());
        e.dataTransfer.setData("enemyID", enemyID.toString());
        console.log(wordID);
        console.log(enemyID);
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
    }

    return (
        <section className="cardenemy-wrapper">
            <section className="cardenemy-card">
                <section className="cardenemy-main">
                    <section className="cardenemy-banner">
                        {name.name ? (
                            <img
                                src={`/assets/images/sprite/profile-${name.name}.png`}
                                alt={`Enemy ${name.name}`}
                            />
                        ) : (
                            <div></div>
                        )}
                        <button onClick={togglePopup}>change</button>
                    </section>

                    <section className="cardenemy-details">
                        <div className="name">
                            <span>Name</span>
                            <h1>{name.name}</h1>
                        </div>

                        <div className="total">
                            <span>Words held</span>
                            <p>{enemy.words.length}</p>
                        </div>
                    </section>

                    <section className="cardenemy-control">
                        <button onClick={() => removeEnemy(index)}>X</button>
                        <button onClick={toggleWords}>
                            {showWords ? "^" : "v"}
                        </button>
                    </section>
                </section>
                {showWords && (
                    <div
                        className="cardenemy-words"
                        onDrop={handleOnDrop}
                        onDragOver={handleDragOver}
                    >
                        <p>Drag and Drop</p>
                        {simulationWords.simulationWords.map((wordItem, id) => (
                            <span
                                key={id}
                                className={`word-item`}
                                draggable
                                onDragStart={(e) => handleOnDrag(e, id, index)}
                            >
                                {wordItem.word}
                            </span>
                        ))}
                    </div>
                )}

                {showPopup && (
                    <section>
                        <div className="cardenemy-popup">
                            <button
                                onClick={togglePopup}
                                className="close-popup"
                            >
                                X
                            </button>
                            <div
                                onClick={() => {
                                    updateEnemyImagePath(
                                        index,
                                        "&melee_spring-a28-i11"
                                    );
                                    togglePopup();
                                }}
                                className="cardenemy-assgin"
                            >
                                <img
                                    src={`/assets/images/sprite/profile-spring.png`}
                                    alt={`Enemy spring`}
                                />
                                <button>Spring</button>
                            </div>
                            <div
                                onClick={() => {
                                    updateEnemyImagePath(
                                        index,
                                        "&melee_crab-a20-i20"
                                    );
                                    togglePopup();
                                }}
                                className="cardenemy-assgin"
                            >
                                <img
                                    src={`/assets/images/sprite/profile-crab.png`}
                                    alt={`Enemy crab`}
                                />
                                <button>Crab</button>
                            </div>
                            <div
                                onClick={() => {
                                    updateEnemyImagePath(
                                        index,
                                        "&range_battery-a21-i20"
                                    );
                                    togglePopup();
                                }}
                                className="cardenemy-assgin"
                            >
                                <img
                                    src={`/assets/images/sprite/profile-battery.png`}
                                    alt={`Enemy battery`}
                                />
                                <button>Crab</button>
                            </div>
                        </div>
                    </section>
                )}
            </section>
        </section>
    );
};

export default CardEnemy;
