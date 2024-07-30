import React, { useState, useRef } from "react";
import Draggable  from "react-draggable";
import "./cardenemy.scss";
import useImageParse from "@/hook/useImageParse";
import { useAuthStore } from "@/store/authStore";

interface SimulationWords {
    simulationWordsID: number;
    creatorID: number;
    word: string;
    silentIndex: string;
}

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
    const { userID } = useAuthStore.getState();

    const toggleWords = () => {
        setShowWords(!showWords);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    function handleOnDrop(e: React.DragEvent) {
        e.preventDefault();

        const word = e.dataTransfer.getData("word");
        const simulationWordsID = parseInt(e.dataTransfer.getData("simulationWordsID"));

        if (word) {
            updateEnemyWords(index, [...enemy.words, simulationWordsID]);
        }
        console.log(word)
        console.log(enemy)
    }

    function handleOnDrag(e: React.DragEvent, wordID: number, enemyID: any ) {
        e.dataTransfer.setData("wordID", wordID.toString());
        e.dataTransfer.setData("enemyID", enemyID.toString());
        console.log(wordID)
        console.log(enemyID)
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
                        <button onClick={() => removeEnemy(index)}>X</button>
                        <button onClick={toggleWords}>{showWords ? "^" : "v"}</button>
                    </section>
                </section>
                {showWords && (
                    <div className="cardenemy-words"
                    onDrop={handleOnDrop}
                    onDragOver={handleDragOver}
                    >
                        <p>Drag and Drop</p>
                        {enemy.words.map((wordItem, id) => (
                            <span
                                key={id}
                                className={`word-item`}
                                draggable
                                onDragStart={(e) => handleOnDrag(e, id, index)}
                            >
                                {wordItem}
                            </span>    
                        ))}
                    </div>            
                )}

                {showPopup && (
                    <Draggable nodeRef={popupRef}>
                        <div ref={popupRef} className="cardenemy-popup">
                            <button onClick={togglePopup} className="close-popup">X</button>
                            <div onClick={() => updateEnemyImagePath(index, "melee_spring-a28-i11")} className="cardenemy-assgin">
                                <img src={`/assets/images/sprite/profile-spring.png`} alt={`Enemy spring`} />
                                <button>Spring</button>
                            </div>
                            <div onClick={() => updateEnemyImagePath(index, "melee_crab-a20-i20")} className="cardenemy-assgin">
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
