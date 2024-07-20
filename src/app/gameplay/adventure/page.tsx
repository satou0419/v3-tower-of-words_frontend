"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InputBox } from "@/app/component/Input/Input";
import { useEnemyStore } from "@/store/enemyStore";
import Loading from "@/app/loading";
import useImageParse from "@/hook/useImageParse";
import "./adventure.scss"; // Make sure your SCSS file is imported correctly
import "./animation.scss";
import Modal from "@/app/component/Modal/Modal";
import useAnimationKeyframes from "@/hook/useAnimationKeyframes";
import Confetti from "react-confetti"; // Import Confetti
import useMerriam from "@/hook/useMerriam";
import getUserItems from "@/lib/item-endpoint/getUserItem";
import { useItemStore } from "@/store/itemStore";
import useAddWord from "@/hook/useAddWord"; // Import the custom hook
import useProgressEquippedStore from "@/store/progressEquippedStore";
import getUserDetails from "@/lib/user-endpoint/getUserDetails";

const AdventureGameplay = () => {
    const searchParams = useSearchParams();
    const userEquipped = useProgressEquippedStore(
        (state) => state.progressEquipped
    );

    useEffect(() => {
        getUserDetails();
    }, []);
    const floorId = searchParams.get("floorId");
    const { enemies, fetchEnemies } = useEnemyStore();
    const [enemyData, setEnemyData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentEnemyIndex, setCurrentEnemyIndex] = useState<number>(0);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [typedWord, setTypedWord] = useState<string>("");
    const [defeatedEnemies, setDefeatedEnemies] = useState<number[]>([]);
    const [isCharacterAttacking, setIsCharacterAttacking] =
        useState<boolean>(false);
    const [isEnemyAttacking, setIsEnemyAttacking] = useState<boolean>(false);
    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
    const [lives, setLives] = useState<number>(5);
    const [spelledWords, setSpelledWords] = useState<Record<number, boolean[]>>(
        {}
    );
    const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true); // State for showing welcome modal
    const [gameStarted, setGameStarted] = useState<boolean>(false); // State for tracking game start
    const [showConfetti, setShowConfetti] = useState<boolean>(false); // State for showing confetti

    const [characterAttackType, setCharacterAttackType] = useState("");
    const [enemyAttackType, setEnemyAttackType] = useState("");
    const [enemyHit, setEnemyHit] = useState("");
    const [characterHit, setCharacterHit] = useState("");
    const [userItems, setUserItems] = useState<any[]>([]);
    const setItems = useItemStore.getState().setItems;

    const {
        addWord,
        isLoading: isAddingWord,
        error: addWordError,
    } = useAddWord(); // Use the custom hook

    useEffect(() => {
        (async () => {
            const items = await getUserItems();
            setUserItems(items);
            setItems(items);
        })();
    }, [setItems]);

    useEffect(() => {
        if (floorId) {
            fetchEnemies(Number(floorId));
        }
    }, [floorId, fetchEnemies]);

    useEffect(() => {
        if (enemies.length > 0) {
            setEnemyData(enemies);
            setLoading(false);
            const initialSpelledWords: Record<number, boolean[]> = {};
            enemies.forEach((enemy, index) => {
                initialSpelledWords[index] = new Array(enemy.words.length).fill(
                    false
                );
            });
            setSpelledWords(initialSpelledWords);
        }
    }, [enemies]);

    const characterDetails = useImageParse(userEquipped.equippedCharacter);

    useEffect(() => {
        if (characterDetails.name) {
            const characterImage = new Image();
            characterImage.src = `/assets/images/sprite/${characterDetails.name}.png`;
            characterImage.onload = () => setImagesLoaded(true);
        }
    }, [characterDetails.name]);

    const currentEnemy = enemyData[currentEnemyIndex];
    const enemyDetails = useImageParse(
        enemyData[currentEnemyIndex]?.imagePath || ""
    );

    useEffect(() => {
        if (enemyDetails.name) {
            const enemyImage = new Image();
            enemyImage.src = `/assets/images/sprite/${enemyDetails.name}.png`;
            enemyImage.onload = () => setImagesLoaded(true);
        }
    }, [enemyDetails.name]);

    const currentWord = currentEnemy?.words[currentWordIndex];
    const word = useMerriam(currentWord); // Pass the currentWord to the custom hook

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTypedWord(event.target.value);
    };

    const characterAnimation = useAnimationKeyframes(
        isCharacterAttacking ? "attack" : "idle",
        characterDetails.name,
        characterDetails.idleFrame,
        characterDetails.attackFrame
    );

    const enemyAnimation = useAnimationKeyframes(
        isEnemyAttacking ? "attack" : "idle",
        enemyDetails.name,
        enemyDetails.idleFrame,
        enemyDetails.attackFrame
    );

    const handleEnemyAttack = () => {
        if (enemyDetails.attackType == "melee") {
            setEnemyAttackType("expand-width");

            setTimeout(() => {
                setIsEnemyAttacking(true);
                // playEnemyAttackSound(); // Play the attack sound when the enemy attacks
            }, 800);

            setTimeout(() => {
                setIsEnemyAttacking(false);
                setCharacterHit("hit");
                setCharacterAttackType("");

                // Set character hit to "" after the hit duration
                setTimeout(() => {
                    setEnemyAttackType("shrink-width");
                    setCharacterHit("");
                }, 500); // 500ms is the duration of the hit
            }, (enemyDetails.attackFrame / 12) * 1000 + 800); // Main enemy attack duration
        } else {
            setIsEnemyAttacking(true);

            setTimeout(() => {
                setIsEnemyAttacking(false);
                setCharacterHit("hit");

                // Set character hit to "" after the hit duration
                setTimeout(() => {
                    setCharacterHit("");
                }, 500); // 500ms is the duration of the hit
            }, (enemyDetails.attackFrame / 12) * 1000); // Main enemy attack duration for non-melee
        }
    };

    const handleCharacterAttack = () => {
        if (characterDetails.attackType == "melee") {
            setCharacterAttackType("expand-width");

            setTimeout(() => {
                setIsCharacterAttacking(true);
            }, 500);

            setTimeout(() => {
                setIsCharacterAttacking(false);
                setCharacterAttackType("shrink-width");
                setEnemyAttackType("");
                setEnemyHit("hit");

                // Set character hit to "" after the hit duration
                setTimeout(() => {
                    setEnemyHit("");
                }, 500); // 500ms is the duration of the hit
            }, (characterDetails.attackFrame / 12) * 1000); // Main enemy attack duration
        } else {
            setIsCharacterAttacking(true);

            setTimeout(() => {
                setIsCharacterAttacking(false);
                setEnemyHit("hit");

                // Set character hit to "" after the hit duration
                setTimeout(() => {
                    setEnemyHit("");
                }, 500); // 500ms is the duration of the hit
            }, (characterDetails.attackFrame / 12) * 1000); // Main enemy attack duration for non-melee
        }
    };

    const handleMissedAttack = () => {
        if (characterDetails.attackType == "melee") {
            setCharacterAttackType("expand-width");
            setTimeout(() => {
                setIsCharacterAttacking(true);
            }, 500);

            setTimeout(() => {
                setIsCharacterAttacking(false);
                setCharacterAttackType("shrink-width");
                setEnemyAttackType("");
            }, (characterDetails.attackFrame / 12) * 1000);
        } else {
            setIsCharacterAttacking(true);

            setTimeout(() => {
                setIsCharacterAttacking(false);
            }, (characterDetails.attackFrame / 12) * 1000); // Main enemy attack duration for non-melee
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentEnemy = enemyData[currentEnemyIndex];
        const currentWord = currentEnemy.words[currentWordIndex].toLowerCase();

        if (typedWord.toLowerCase() === currentWord) {
            // Correct word spelling
            setTypedWord("");
            handleCharacterAttack();

            const updatedSpelledWords = { ...spelledWords };
            updatedSpelledWords[currentEnemyIndex][currentWordIndex] = true;
            setSpelledWords(updatedSpelledWords);

            // Archive the correctly spelled word
            await addWord(currentWord);

            setTimeout(() => {
                setIsCharacterAttacking(false);

                if (currentWordIndex === currentEnemy.words.length - 1) {
                    // Last word for this enemy defeated
                    setDefeatedEnemies((prevDefeatedEnemies) => [
                        ...prevDefeatedEnemies,
                        currentEnemyIndex,
                    ]);

                    setTimeout(() => {
                        if (currentEnemyIndex === enemyData.length - 1) {
                            // All enemies defeated, show confetti
                            setShowConfetti(true);
                        } else {
                            setCurrentEnemyIndex(currentEnemyIndex + 1);
                            setCurrentWordIndex(0);
                        }
                    }, 500); // Add delay before switching to next enemy (adjust as needed)
                } else {
                    setCurrentWordIndex(currentWordIndex + 1);
                }
            }, (characterDetails.attackFrame / 12) * 1000); // Adjust timing as needed
        } else {
            handleMissedAttack();
            setTimeout(() => {
                handleEnemyAttack();
            }, (characterDetails.attackFrame / 12) * 2000);
        }
    };

    useEffect(() => {
        console.log("Character Hit", characterHit);
        console.log("Enemy Hit", enemyHit);
    }, [characterHit, enemyHit]);

    useEffect(() => {
        // Play audio on word change
        if (word && word.playAudio) {
            setTimeout(() => {
                word.playAudio();
            }, 1500);
        }
    }, [word]); // Trigger on word change

    useEffect(() => {
        // Handle key down event for shift key to play audio
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Shift") {
                if (word && word.playAudio) {
                    word.playAudio();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [word]); // Trigger on word change

    const handleItemUse = (itemID: string) => {
        const item = userItems.find((item) => item.itemID.itemID === itemID);
        if (item && item.quantity > 0) {
            // Implement item effect logic here
            if (item.itemID.effectType === "heal") {
                setLives((prevLives) =>
                    Math.min(prevLives + item.itemID.effectValue, 5)
                );
            }

            // Update item quantity
            const updatedItems = userItems.map((userItem) =>
                userItem.itemID.itemID === itemID
                    ? { ...userItem, quantity: userItem.quantity - 1 }
                    : userItem
            );
            setUserItems(updatedItems);
        }
    };

    const welcomeModalButtons = [
        <button
            key="start-game"
            onClick={() => {
                setShowWelcomeModal(false);
                setGameStarted(true); // Start the game when the modal is closed
            }}
        >
            Start Game
        </button>,
    ];

    if (!floorId || loading || !imagesLoaded) {
        return <Loading />;
    }

    return (
        <main className="adventure-wrapper">
            <Modal
                isOpen={showWelcomeModal}
                onClose={() => setShowWelcomeModal(false)}
                title="Welcome to Adventure Game"
                details="Defeat all the enemies to win!"
                buttons={welcomeModalButtons}
            />
            {gameStarted && (
                <section className="adventure-platform">
                    <div className="platform-indicator">Floor {floorId}</div>
                    <span>Word to Spell: {currentWord}</span>{" "}
                    <span>{characterAnimation}</span>
                    <span>{currentEnemy.imagePath}</span>
                    <section className="enemy-track">
                        {enemyData.map((enemy, enemyIndex) => (
                            <div key={enemyIndex} className="enemy-track-list">
                                {enemyIndex > 0 && (
                                    <div className="enemy-connector"></div>
                                )}
                                <div
                                    className={`enemy-track-profile ${
                                        defeatedEnemies.includes(enemyIndex)
                                            ? "defeated"
                                            : ""
                                    }`}
                                >
                                    Name: {currentEnemy.name}
                                </div>
                                {enemy.words.map(
                                    (word: any, wordIndex: any) => (
                                        <React.Fragment key={wordIndex}>
                                            <div className="enemy-connector"></div>
                                            <div
                                                className={`enemy-word ${
                                                    spelledWords[enemyIndex]?.[
                                                        wordIndex
                                                    ]
                                                        ? "spelled"
                                                        : ""
                                                }`}
                                            ></div>
                                        </React.Fragment>
                                    )
                                )}
                            </div>
                        ))}
                    </section>
                    <section className="sprite-holder">
                        <section
                            className={` character-container ${characterAttackType} ${characterHit}`}
                        >
                            <div
                                className={` character-sprite ${
                                    isCharacterAttacking
                                        ? `attack-${characterDetails.name}`
                                        : `idle-${characterDetails.name}`
                                }`}
                                style={{
                                    border: "2px solid white",
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    backgroundImage: `url("/assets/images/sprite/${characterDetails.name}.png")`,
                                    width: `360px`, // Width of each frame in the sprite sheet
                                    height: `360px`, // Adjust based on sprite sheet
                                    animation: `${
                                        isCharacterAttacking
                                            ? `attack-${characterDetails.name}`
                                            : `idle-${characterDetails.name}`
                                    } calc(${
                                        isCharacterAttacking
                                            ? `calc(${characterDetails.attackFrame}s / 12)`
                                            : `calc(${characterDetails.idleFrame}s / 12)`
                                    }) steps(${
                                        isCharacterAttacking
                                            ? `${characterDetails.attackFrame}`
                                            : `${characterDetails.idleFrame}`
                                    }) infinite`,
                                }}
                            >
                                <style>
                                    {`
                ${characterAnimation}
                `}
                                </style>
                            </div>
                        </section>
                        <section
                            className={`enemy-container ${enemyAttackType} ${enemyHit}`}
                        >
                            <div
                                className={`enemy-sprite ${
                                    isEnemyAttacking
                                        ? `attack-${enemyDetails.name}`
                                        : `idle-${enemyDetails.name}`
                                }`}
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    border: "2px solid white",
                                    backgroundImage: `url("/assets/images/sprite/${enemyDetails.name}.png")`,
                                    width: `360px`, // Width of each frame in the sprite sheet
                                    height: `360px`, // Adjust based on sprite sheet
                                    animation: `${
                                        isEnemyAttacking
                                            ? `attack-${enemyDetails.name}`
                                            : `idle-${enemyDetails.name}`
                                    } calc(${
                                        isEnemyAttacking
                                            ? `calc(${enemyDetails.attackFrame}s / 12)`
                                            : `calc(${enemyDetails.idleFrame}s / 12)`
                                    }) steps(${
                                        isEnemyAttacking
                                            ? `${enemyDetails.attackFrame}`
                                            : `${enemyDetails.idleFrame}`
                                    }) infinite`,
                                }}
                            >
                                <style>
                                    {`
        ${enemyAnimation}
        `}
                                </style>
                                {enemyAnimation}
                            </div>
                        </section>
                    </section>
                </section>
            )}
            {gameStarted && (
                <section className="adventure-control">
                    <img src="/assets/images/background/bg-border_large.webp" />
                    <section className="control-item">
                        {userItems.map((item) => (
                            <div
                                key={item.itemID.itemID}
                                className="item-box"
                                onClick={() =>
                                    handleItemUse(item.itemID.itemID)
                                }
                            >
                                <img
                                    src={`/assets/images/reward/${item.itemID.imagePath}`}
                                    alt={item.itemID.itemName}
                                />
                                <span>{item.quantity}x</span>
                            </div>
                        ))}
                        {[...Array(3)].map((_, index) => (
                            <div
                                key={`empty-${index}`}
                                className="item-box empty"
                            >
                                <img
                                    src="/assets/images/reward/empty.png"
                                    alt="Empty"
                                />
                                <span>0x</span>
                            </div>
                        ))}
                    </section>
                    <section className="control-input">
                        <form onSubmit={handleSubmit}>
                            <button type="button" onClick={word?.playAudio}>
                                🔉
                            </button>
                            <InputBox
                                type="text"
                                value={typedWord}
                                onChange={handleInputChange}
                                placeholder="Type the word..."
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                    </section>
                    <section className="control-clue">
                        <h1>Word's Info</h1>

                        <section className="clue-container">
                            <span>Pronunciation</span>
                            <div className="clue-pronunciation">
                                <span>{word?.pronunciation}</span>
                            </div>

                            <span>Definition</span>

                            <div className="clue-definition">
                                <span>{word?.definition}</span>
                            </div>
                        </section>
                    </section>
                </section>
            )}
            {showConfetti && <Confetti />}{" "}
            {/* Show confetti when all enemies are defeated */}
        </main>
    );
};

export default AdventureGameplay;
