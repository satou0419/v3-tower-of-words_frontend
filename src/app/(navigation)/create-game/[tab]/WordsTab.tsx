// WordsTab.tsx
import React from "react";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import CardEnemy from "@/app/component/Card/CardEnemy/CardEnemy";

const WordsTab = () => {
    return (
        <section className="myword-wrapper">
            <section className="myword-left_container">
                <h1>My Words</h1>
                <CardWord className="myword-left" />
            </section>
            <section className="myword-right_container">
                <h1>Enemy List</h1>
                <section className="enemylist-container">
                    <CardEnemy />
                </section>
            </section>
        </section>
    );
};

export default WordsTab;
