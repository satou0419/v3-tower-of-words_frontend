import React, { useState, useRef } from "react";
import Draggable  from "react-draggable";
import "./cardenemy.scss";
import useImageParse from "@/hook/useImageParse";

interface SimulationWords {
    simulationWordsID: number;
    word: string;
}

interface CardEnemyProps {
    enemy: {
        id: number;
        imagePath: string;
        words: SimulationWords[];
    };
    removeEnemy: (id: number) => void;
    updateEnemyWords: (id: number, updatedWords: SimulationWords[]) => void;
    updateEnemyImagePath: (id: number, imagePath: string) => void;
}

const CardEnemy: React.FC<CardEnemyProps> = ({
    enemy,
    removeEnemy,
    updateEnemyWords,
    updateEnemyImagePath,
}) => {
    const [showWords, setShowWords] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const name = useImageParse(enemy.imagePath);
    const popupRef = useRef<HTMLDivElement>(null);

    const toggleWords = () => {
        setShowWords(!showWords);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    function handleOnDrop(e: React.DragEvent) {
        e.preventDefault();

        const word = e.dataTransfer.getData("word");

        if (word) {
            const newWord: SimulationWords = {
                simulationWordsID: enemy.words.length > 0 ? enemy.words[enemy.words.length - 1].simulationWordsID + 1 : 1,
                word: word,
            };

            updateEnemyWords(enemy.id, [...enemy.words, newWord]);
        }
        console.log(word)
        console.log(enemy.id)
    }

    function handleOnDrag(e: React.DragEvent, word: string, wordID: number, enemyID: number ) {
        e.dataTransfer.setData("word", word);
        e.dataTransfer.setData("wordID", wordID.toString());
        e.dataTransfer.setData("enemyID", enemyID.toString());
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
    }

    return (
        <section className="cardenemy-wrapper">
            <section className="cardenemy-card">
                <section className="cardenemy-main">
                    <section className="cardenemy-banner">
                        <img src={`/assets/images/sprite/profile-${name.name}.png`} alt={`Enemy ${name.name}`} />
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
                        <button onClick={() => removeEnemy(enemy.id)}>X</button>
                        <button onClick={toggleWords}>{showWords ? "^" : "v"}</button>
                    </section>
                </section>
                {showWords && (
                    <div className="cardenemy-words"
                    onDrop={handleOnDrop}
                    onDragOver={handleDragOver}
                    >
                        <p>Drag and Drop</p>
                        {enemy.words.map((wordItem, index) => (
                            <span
                                key={wordItem.simulationWordsID}
                                className={`word-item`}
                                draggable
                                onDragStart={(e) => handleOnDrag(e, wordItem.word, wordItem.simulationWordsID, enemy.id)}
                            >
                                {wordItem.word}
                            </span>    
                        ))}
                    </div>            
                )}

                {showPopup && (
                    <Draggable nodeRef={popupRef}>
                        <div ref={popupRef} className="cardenemy-popup">
                            <button onClick={togglePopup} className="close-popup">X</button>
                            <div onClick={() => updateEnemyImagePath(enemy.id, "melee_spring-a28-i11")} className="cardenemy-assgin">
                                <img src={`/assets/images/sprite/profile-spring.png`} alt={`Enemy spring`} />
                                <button>Spring</button>
                            </div>
                            <div onClick={() => updateEnemyImagePath(enemy.id, "melee_crab-a20-i20")} className="cardenemy-assgin">
                                <img src={`/assets/images/sprite/profile-crab.png`} alt={`Enemy crab`} />
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
