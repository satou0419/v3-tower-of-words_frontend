// WordsTab.tsx
import React, { useEffect, useState } from "react";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import CardEnemy from "@/app/component/Card/CardEnemy/CardEnemy";
import { InputLine } from "@/app/component/Input/Input";
import viewSimulationWords from "@/lib/simulation-endpoint/viewSimulationWords";

interface Enemy {
    id: number;
    imagePath: string;
    words: SimulationWords[];
}

interface SimulationWords {
    simulationWordsID: number;
    word: string;
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

    function handleOnDrag(e: React.DragEvent, word: string) {
        e.dataTransfer.setData("word", word);
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
                        <div className="word-list">
                            {simulationWords.length > 0 ? (
                                simulationWords.map((wordItem, index) => (
                                    <span
                                        key={
                                            wordItem.simulationWordsID ||
                                            wordItem.word
                                        }
                                        className={`word-item`}
                                        draggable
                                        onDragStart={(e) =>
                                            handleOnDrag(e, wordItem.word)
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
                    {enemies.map((enemy) => (
                        <CardEnemy
                            key={enemy.id}
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
