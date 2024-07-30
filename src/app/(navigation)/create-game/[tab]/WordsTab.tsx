// WordsTab.tsx
import React, { useEffect, useState } from "react";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import CardEnemy from "@/app/component/Card/CardEnemy/CardEnemy";
import { InputLine } from "@/app/component/Input/Input";
import viewSimulationWords from "@/lib/simulation-endpoint/viewSimulationWords";

interface Enemy {
    imagePath: string;
    words: SimulationWords[];
}

interface SimulationWords {
    simulationWordsID: number;
    creatorID: number;
    word: string;
    silentIndex: string;
}

interface WordsTabProps {
    enemies: Enemy[];
    addEnemy: () => void;
    removeEnemy: (id: number) => void;
    updateEnemyWords: (id: number, updatedWords: SimulationWords[]) => void;
    updateEnemyImagePath: (id: number, imagePath: string) => void;
}

const WordsTab: React.FC<WordsTabProps> = ({
    enemies,
    addEnemy,
    removeEnemy,
    updateEnemyWords,
    updateEnemyImagePath,
}) => {
    const [searchWords, setSearchWords] = useState("");
    const [simulationWords, setSimulationWords] = useState<SimulationWords[]>(
        []
    );

    console.log(simulationWords)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await viewSimulationWords();
                setSimulationWords(data || []);
            } catch (error) {
                console.error("Error fetching simulation words:", error);
                setSimulationWords([]);
            }
        };

        fetchData();
    }, []);

    function handleOnDrag(e: React.DragEvent, word: string, simulationWordsID: number) {
        console.log(simulationWordsID)
        e.dataTransfer.setData("word", word);
        e.dataTransfer.setData("simulationWordsID", simulationWordsID.toString());
        
    }

    function handleOnDrop(e: React.DragEvent) {
        e.preventDefault();

        const wordID = parseInt(e.dataTransfer.getData("wordID"), 10);
        const enemyID = parseInt(e.dataTransfer.getData("enemyID"), 10);

        if (!isNaN(wordID) && !isNaN(enemyID)) {
            const enemy = enemies.find((enemy, index) => index === enemyID);
            if (enemy) {
                const updatedWords = enemy.words.filter((word, index) => index !== wordID);
                updateEnemyWords(enemyID, updatedWords);
            }
        }

        console.log(wordID)
        console.log(enemyID)
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
    }

    console.log(enemies);

    return (
        <section className="myword-wrapper">
            <section className="myword-left_container">
                <h1>My Words</h1>
                <CardWord className="myword-left">
                    <div className="left-container">
                        <InputLine
                            type="text"
                            placeholder="Search"
                            value={searchWords}
                            onChange={(e) => setSearchWords(e.target.value)}
                        />
                        <div className="word-list" 
                        onDrop={handleOnDrop}
                        onDragOver={handleDragOver}
                        >
                            {simulationWords.length > 0 ? (
                                simulationWords.map((wordItem, index) => (
                                    <span
                                        key={
                                            index ||
                                            wordItem.word
                                        }
                                        className={`word-item`}
                                        draggable
                                        onDragStart={(e) =>
                                            handleOnDrag(e, wordItem.word, wordItem.simulationWordsID)
                                        }
                                    >
                                        {wordItem.word}
                                    </span>
                                ))
                            ) : (
                                <h1>No words available</h1>
                            )}
                        </div>
                    </div>
                </CardWord>
            </section>
            <section className="myword-right_container">
                <section className="myword-right_heading">
                    <h1>Enemy List</h1>
                    <button onClick={addEnemy}>Add Enemy</button>
                </section>
                <section className="enemylist-container">
                    {enemies.map((enemy, index) => (
                        <CardEnemy
                            key={index}
                            index={index}
                            enemy={enemy}
                            removeEnemy={removeEnemy}
                            updateEnemyWords={updateEnemyWords}
                            updateEnemyImagePath={updateEnemyImagePath}
                        />
                    ))}
                </section>
            </section>
        </section>
    );
};

export default WordsTab;
