// WordsTab.tsx
import React,{ useState } from "react";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import CardEnemy from "@/app/component/Card/CardEnemy/CardEnemy";

interface Enemy {
    id: number;
    imagePath: string;
    word: string[];
}

interface WordsTabProps {
    enemies: Enemy[];
    addEnemy: () => void;
    removeEnemy: (id: number) => void;
}

const WordsTab: React.FC<WordsTabProps> = ({ enemies, addEnemy, removeEnemy }) => {
    return (
        <section className="myword-wrapper">
            <section className="myword-left_container">
                <h1>My Words</h1>
                <CardWord className="myword-left" />
            </section>
            <section className="myword-right_container">
                <section className="myword-right_heading">
                    <h1>Enemy List</h1>
                    <button onClick={addEnemy}>Add Enemy</button>
                </section>
                <section className="enemylist-container">
                    {enemies.map((enemy) => (
                        <CardEnemy key={enemy.id} enemy={enemy} removeEnemy={removeEnemy} />
                    ))}
                </section>
            </section>
        </section>
    );
};

export default WordsTab;
