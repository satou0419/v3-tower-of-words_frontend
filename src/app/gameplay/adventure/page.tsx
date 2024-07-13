"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InputBox } from "@/app/component/Input/Input";
import { useEnemyStore } from "@/store/enemyStore";
import "./adventure.scss"; // Make sure your SCSS file is imported correctly
import Loading from "@/app/loading";

const AdventureGameplay = () => {
    const searchParams = useSearchParams();
    const floorId = searchParams.get("floorId");
    const { enemies, fetchEnemies } = useEnemyStore();
    const [enemyData, setEnemyData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentEnemyIndex, setCurrentEnemyIndex] = useState<number>(0);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [typedWord, setTypedWord] = useState<string>("");
    const [defeatedEnemies, setDefeatedEnemies] = useState<string[]>([]);
    const [isAttacking, setIsAttacking] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [lives, setLives] = useState<number>(5); // Add state for lives
    const [attackType, setAttackType] = useState<string>("");

    useEffect(() => {
        if (floorId) {
            fetchEnemies(Number(floorId));
        }
    }, [floorId, fetchEnemies]);

    useEffect(() => {
        if (enemies.length > 0) {
            setEnemyData(enemies);
            setLoading(false);
        }
    }, [enemies]);

    useEffect(() => {
        const img = new Image();
        img.src = "/assets/images/sprite/cannon.png";
        img.onload = () => setImageLoaded(true); // Set image loaded state when the combined sprite image is loaded
    }, []);

    const parseImagePath = (path: string) => {
        if (path.startsWith("&")) {
            path = path.slice(1);
        }

        const attackType = path.substring(0, path.indexOf("_"));
        const name = path.substring(path.indexOf("_") + 1, path.indexOf("-"));
        const idleFrame = path.substring(
            path.indexOf("-i") + 2,
            path.lastIndexOf("_")
        );
        const attackFrame = path.substring(path.indexOf("-a") + 2);

        return { attackType, name, idleFrame, attackFrame };
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTypedWord(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentEnemy = enemyData[currentEnemyIndex];
        const currentWord = currentEnemy.words[currentWordIndex].toLowerCase();

        if (typedWord.toLowerCase() === currentWord) {
            // Correct word spelling
            setTypedWord("");
            const { attackType } = parseImagePath(currentEnemy.imagePath);
            setAttackType(attackType); // Update attackType state

            setIsAttacking(true); // Trigger attack animation after correct spelling

            setTimeout(() => {
                setIsAttacking(false);

                if (currentWordIndex === currentEnemy.words.length - 1) {
                    // Last word for this enemy defeated
                    const enemyName = parseImagePath(
                        currentEnemy.imagePath
                    ).name;
                    setDefeatedEnemies([...defeatedEnemies, enemyName]);

                    if (currentEnemyIndex === enemyData.length - 1) {
                        alert("All enemies defeated!");
                    } else {
                        setCurrentEnemyIndex(currentEnemyIndex + 1);
                        setCurrentWordIndex(0);
                    }
                } else {
                    setCurrentWordIndex(currentWordIndex + 1);
                }
            }, 2000); // Adjust timing as needed
        } else {
            // Incorrect word spelling
            setLives(lives - 1); // Decrement lives
            if (lives - 1 === 0) {
                alert("Game Over!");
            } else {
                alert(
                    `Incorrect word spelling. You have ${lives - 1} lives left.`
                );
            }
        }
    };

    useEffect(() => {
        if (enemyData.length > 0) {
            const currentEnemy = enemyData[currentEnemyIndex];
            const { attackType } = parseImagePath(currentEnemy.imagePath);
            setAttackType(attackType); // Update attackType state

            // Determine if the enemy is attacking based on attackType
            setIsAttacking(true); // Assume always attacking for now
        }
    }, [currentEnemyIndex, enemyData]);

    if (!floorId || loading || !imageLoaded) {
        return <Loading />;
    }

    const currentEnemy = enemyData[currentEnemyIndex];
    const currentWord = currentEnemy.words[currentWordIndex];

    return (
        <main className="adventure-wrapper">
            <section className="adventure-platform">
                <div className="platform-indicator">Floor {floorId}</div>
                {/* <div style={{ marginBottom: "20px" }}>
                    <h2>Enemy {currentEnemyIndex + 1}</h2>
                    <div>
                        <span>Attack Type: {attackType}</span>
                        <span>Word to Spell: {currentWord}</span>
                    </div>
                    <div>
                        <span>Lives: {lives}</span> 
                    </div>
                </div> */}

                <section className="sprite-holder">
                    <section
                        className="character-container"
                        // style={
                        //     isAttacking && attackType === "melee"
                        //         ? { animation: "expand-width 0.5s forwards" }
                        //         : undefined
                        // }
                    >
                        <div
                            className={`character-sprite ${
                                isAttacking ? "attack" : "idle"
                            }`}
                            style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                backgroundImage: `url("/assets/images/sprite/cannon.png")`,
                                width: `205px`, // Width of each frame in the sprite sheet
                                height: isAttacking ? `225px` : `205px`, // Position for attack frames
                                animation: `${
                                    isAttacking ? "attack" : "idle"
                                } calc(${
                                    isAttacking ? "22s / 12" : "17s / 12"
                                }) steps(${
                                    isAttacking ? "22" : "17"
                                }) infinite`,
                            }}
                        ></div>
                    </section>
                    <section className="enemy-container">
                        <div className="enemy-sprite"></div>
                    </section>
                </section>
            </section>

            <section className="adventure-control">
                <img src="/assets/images/background/bg-border_large.webp" />

                <section className="control-item">
                    <div className="item-box">
                        <span>x</span>
                    </div>
                    <div className="item-box">
                        <span>x</span>
                    </div>
                    <div className="item-box">
                        <span>x</span>
                    </div>
                </section>
                <section className="control-input">
                    <form onSubmit={handleSubmit}>
                        <button>play</button>
                        <InputBox
                            type="text"
                            value={typedWord}
                            onChange={handleInputChange}
                            placeholder="Type the word..."
                        />
                        <button type="submit">Submit</button>
                    </form>
                </section>
                <section className="control-clue">
                    <h1>Word's Info</h1>

                    <section className="clue-container">
                        <span>Pronunciation</span>
                        <div className="clue-pronunciation">
                            <span>hape</span>
                        </div>

                        <span>Definition</span>

                        <div className="clue-definition">
                            <span>Define</span>
                        </div>
                    </section>
                </section>
            </section>

            {/* {defeatedEnemies.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Defeated Enemies:</h3>
                    <ul>
                        {defeatedEnemies.map((enemyName, index) => (
                            <li key={index}>Enemy {enemyName} is defeated!</li>
                        ))}
                    </ul>
                </div>
            )} */}
        </main>
    );
};

export default AdventureGameplay;
