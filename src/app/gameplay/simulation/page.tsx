"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InputBox } from "@/app/component/Input/Input";
import useImageParse from "@/hook/useImageParse";
import "./adventure.scss"; // Make sure your SCSS file is imported correctly
import "./animation.scss";
import Modal from "@/app/component/Modal/Modal";
import useAnimationKeyframes from "@/hook/useAnimationKeyframes";
import "./modals.scss";
import useMerriam from "@/hook/useMerriam";
import useProgressEquippedStore from "@/store/progressEquippedStore";
import getUserDetails from "@/lib/user-endpoint/getUserDetails";
import getUserItems from "@/lib/item-endpoint/getUserItem";
import useItem from "@/hook/useItem";
import { useGameplayStore } from "@/store/gameplayStore";
import ConfettiWrapper from "@/app/component/Confetti/Confetti";
import useSimulationDetails from "@/hook/useSimulationDetails";
import useTimer from "@/util/timer";
import useUpdateSimulationProgress from "@/hook/useUpdateSimulationProgress";
import { useAuthStore } from "@/store/authStore";

interface SimulationWordsArray {
    simulationWordsID: number;
    creatorID: number;
    word: string;
    silentIndex: string;
}
interface SimulationEnemy {
    simulationEnemyID: number;
    imagePath: string;
    words: SimulationWordsArray[];
}
interface Item {
    itemID: number;
    name: string;
    imagePath: string;
    description: string;
    price: number;
}
interface UserItem {
    userItemID: number;
    quantity: number;
    userID: number;
    itemID: Item;
}

const SimulationGameplay = () => {
    const { userID } = useAuthStore.getState();
    const searchParams = useSearchParams();

    const simulationIDParam = searchParams.get("simulationID");
    const simulationID = simulationIDParam
        ? parseInt(simulationIDParam, 10)
        : NaN;
    // const [loading, setLoading] = useState<boolean>(true);
    const simulationDetails = useSimulationDetails(simulationID);
    const studentLife = simulationDetails?.simulationDetails?.studentLife ?? 0;
    const [lives, setLives] = useState<number>(studentLife);

    // Set the initial state and update it if studentLife changes
    useEffect(() => {
        setLives(studentLife);
    }, [studentLife]);
    const addLives = (amount: number) => {
        setLives((prevLives) => prevLives + amount);
    };

    const subtractLives = (amount: number) => {
        setLives((prevLives) => Math.max(prevLives - amount, 0)); // Ensure lives don't go below 0
    };

    const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true); // State for showing welcome modal
    const [gameStarted, setGameStarted] = useState<boolean>(false); // State for tracking game start
    const [isPronunciationLocked, setIsPronunciationLocked] = useState(
        simulationDetails.simulationDetails?.pronunciation
    );
    const [isDefinitionLocked, setIsDefinitionLocked] = useState(
        simulationDetails.simulationDetails?.description
    );
    const [isItemLocked] = useState(simulationDetails.simulationDetails?.items);

    const lockedPronunciation = isPronunciationLocked ? "locked" : "";
    const lockedDefinition = isDefinitionLocked ? "locked" : "";
    const [showConquerFloorModal, setShowConquerFloorModal] = useState(false);

    //#region  Item Logic
    const [userItems, setUserItems] = useState<UserItem[]>([]);
    const [showConfirmationModal, setShowConfirmationModal] =
        useState<boolean>(false);
    const [itemToUse, setItemToUse] = useState<{
        id: number;
        name: string;
    } | null>(null);

    useEffect(() => {
        const fetchUserItems = async () => {
            const items = await getUserItems();
            setUserItems(items);
        };

        fetchUserItems();
    }, []);

    const { useItemFunction } = useItem();

    const handleUseItem = (itemID: number, itemName: string) => {
        // Set the item to use and show the confirmation modal
        setItemToUse({ id: itemID, name: itemName });
        setShowConfirmationModal(true);
    };

    const confirmUseItem = async () => {
        if (itemToUse) {
            const { id, name } = itemToUse;
            try {
                await useItemFunction(id);
                console.log(name);
                switch (name) {
                    case "Bandage":
                        addLives(1);
                        break;
                    case "Medical Kit":
                        addLives(3);
                        break;
                    case "Unusual Battery":
                        setIsPronunciationLocked(false);
                        break;
                }
                // Fetch updated user items after successful use
                const updatedItems = await getUserItems();
                setUserItems(updatedItems);
            } catch (error) {
                console.error("Failed to use item:", error);
            } finally {
                // Close the confirmation modal after processing
                setShowConfirmationModal(false);
                setItemToUse(null);
            }
        }
    };

    const cancelUseItem = () => {
        // Close the confirmation modal without using the item
        setShowConfirmationModal(false);
        setItemToUse(null);
    };

    const [showGameOverModal, setShowGameOverModal] = useState<boolean>(false);
    const handleGameOverRestart = () => {
        // Logic to restart the game
        console.log("Restarting game...");
        setShowGameOverModal(false);
        window.location.reload();

        // Add additional logic here to reset the game state
    };

    useEffect(() => {
        console.log("Simu", simulationDetails.simulationDetails);
    }, []);
    const [enemies, setEnemies] = useState<SimulationEnemy[]>([]);

    useEffect(() => {
        setEnemies(simulationDetails.simulationDetails?.enemy || []);
    }, [gameStarted]);

    const [currentEnemyIndex, setCurrentEnemyIndex] = useState<number>(0);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [typedWord, setTypedWord] = useState<string>("");

    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
    const [spelledWords, setSpelledWords] = useState<Record<number, boolean[]>>(
        {}
    );
    const [showConfetti, setShowConfetti] = useState<boolean>(false); // State for showing confetti
    const [defeatedEnemies, setDefeatedEnemies] = useState<number[]>([]);

    useEffect(() => {
        if (enemies.length > 0) {
            const initialSpelledWords: Record<number, boolean[]> = {};
            enemies.forEach((enemy, index) => {
                initialSpelledWords[index] = new Array(enemy.words.length).fill(
                    false
                );
            });
            setSpelledWords(initialSpelledWords);
            console.log("Enemies", enemies);
            console.log("Initial", initialSpelledWords);
        }
    }, [enemies]);

    const [isCharacterAttacking, setIsCharacterAttacking] =
        useState<boolean>(false);
    const [isEnemyAttacking, setIsEnemyAttacking] = useState<boolean>(false);
    const [characterAttackType, setCharacterAttackType] = useState("");
    const [enemyAttackType, setEnemyAttackType] = useState("");
    const [enemyHit, setEnemyHit] = useState("");
    const [characterHit, setCharacterHit] = useState("");

    const userEquipped = useProgressEquippedStore(
        (state) => state.progressEquipped
    );

    useEffect(() => {
        console.log(simulationDetails.simulationDetails);
    }, []);

    useEffect(() => {
        getUserDetails();
    }, []);
    const characterDetails = useImageParse(userEquipped.equippedCharacter);
    const enemyDetails = useImageParse(
        enemies[currentEnemyIndex]?.imagePath || ""
    );

    useEffect(() => {
        if (characterDetails.name) {
            const characterImage = new Image();
            characterImage.src = `/assets/images/sprite/${characterDetails.name}.png`;
            characterImage.onload = () => setImagesLoaded(true);
        }
    }, [characterDetails.name]);

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

    const currentEnemy = enemies[currentEnemyIndex];
    const currentWord = currentEnemy?.words[currentWordIndex].word;
    const word = useMerriam(currentWord); // Pass the currentWord to the custom hook

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTypedWord(event.target.value);
    };

    const [isLastEnemyWord, setIsLastEnemyWord] = useState(false);

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
                subtractLives(1); // Subtract 1 from lives on incorrect input

                setCharacterAttackType("");

                setTimeout(() => {
                    if (lives === 1 || isLastEnemyWord === true) {
                        setShowGameOverModal(true);
                    }
                }, 500);

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

    const time = useTimer();
    const [mistakes, setMistakes] = useState(0);
    const incrementMistake = () => {
        setMistakes((prevMistakes) => prevMistakes + 1);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentEnemy = enemies[currentEnemyIndex];
        const currentWord =
            currentEnemy.words[currentWordIndex].word.toLowerCase();

        console.log(
            `Submitting: Enemy ${currentEnemyIndex + 1}/${enemies.length}`
        );
        console.log(
            `Word ${currentWordIndex + 1}/${
                currentEnemy.words.length
            }: ${typedWord.toLowerCase()}`
        );
        console.log(`Current word to match: ${currentWord}`);

        // Check if the current word matches the expected word or syllable
        if (
            typedWord.toLowerCase() === currentWord ||
            rangeValue === word?.syllable
        ) {
            // Correct word spelling
            console.log("Correct word entered.");

            time.reset();
            const timeSec = time.getFormattedTimeInSeconds();

            //#region Update Progress

            // const studentWordProgressID = simulationDetails.simulationDetails?.enemy[currentEnemyIndex].words[current
            const simulationWordsID =
                simulationDetails.simulationDetails?.enemy[currentEnemyIndex]
                    .words[currentWordIndex].simulationWordsID;

            const studentID = userID;
            const numberOfAttempts = mistakes;
            const duration = time.getFormattedTimeInSeconds();

            const accuracy = ((studentLife - mistakes) / studentLife) * 100;
            console.log("Simulation Words ID: ", simulationWordsID);
            console.log("Stunde ID: ", studentID);
            console.log("Number of Attempts: ", numberOfAttempts);
            console.log("Duration: ", duration);
            console.log("Accuracy", accuracy);

            //#endregion

            setTypedWord("");
            handleCharacterAttack();

            const updatedSpelledWords = { ...spelledWords };
            updatedSpelledWords[currentEnemyIndex][currentWordIndex] = true;
            setSpelledWords(updatedSpelledWords);

            // Prepare progress data
            const progress = {
                simulationWordsID,
                numberOfAttempts: mistakes,
                correct: true,
                score: 0, // Assuming you want to set this dynamically
                duration: timeSec.toString(),
                accuracy,
            };

            setTimeout(() => {
                setIsCharacterAttacking(false);
                setLives(lives);

                // Check if the current word is the last one for this enemy
                const isLastWord =
                    currentWordIndex === currentEnemy.words.length - 1;
                // Check if the current enemy is the last one
                const isLastEnemy = currentEnemyIndex === enemies.length - 1;

                if (isLastWord && isLastEnemy) {
                    // Last word of the last enemy
                    console.log("Last word of the last enemy.");
                    setDefeatedEnemies((prevDefeatedEnemies) => [
                        ...prevDefeatedEnemies,
                        currentEnemyIndex,
                    ]);

                    setTimeout(() => {
                        console.log("All enemies defeated.");
                        setShowConfetti(true);
                        setShowConquerFloorModal(true); // Show the conquering floor modal
                    }, 500); // Add delay before showing confetti and modal
                } else if (isLastWord) {
                    // Last word of current enemy but not the last enemy
                    console.log("Last word for this enemy.");
                    setDefeatedEnemies((prevDefeatedEnemies) => [
                        ...prevDefeatedEnemies,
                        currentEnemyIndex,
                    ]);
                    setCurrentEnemyIndex(currentEnemyIndex + 1);
                    setCurrentWordIndex(0);
                    setIsPronunciationLocked(true);
                } else {
                    console.log(
                        `Proceeding to next word: Word ${currentWordIndex + 1}`
                    );
                    setCurrentWordIndex(currentWordIndex + 1);
                    setIsPronunciationLocked(true);
                }
            }, (characterDetails.attackFrame / 12) * 1000); // Adjust timing as needed
        } else {
            // Incorrect input
            console.log("Incorrect word entered.");
            incrementMistake();
            handleMissedAttack();
            setTimeout(() => {
                handleEnemyAttack();
            }, (characterDetails.attackFrame / 12) * 2000);
        }
    };

    //Play only the audio in gameType 1

    useEffect(() => {
        if (gameStarted && word && word.playAudio) {
            // Play audio on word change
            const timer = setTimeout(() => {
                word.playAudio();
            }, 1000);

            setTimeout(() => {
                console.log("audio ends");
                time.start();
            }, 2000);

            return () => clearTimeout(timer); // Clear the timeout if the component unmounts or word changes
        }
    }, [gameStarted, word]); // Trigger on gameStarted or word change

    useEffect(() => {
        if (!gameStarted) return; // Do nothing if the game hasn't started

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
    }, [gameStarted, word]); // Trigger on gameStarted or word change

    const [rangeValue, setRangeValue] = useState(0);

    const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRangeValue(Number(event.target.value));
    };

    const extractEnemyName = (imagePath: string) => {
        // Match the pattern of &attackType_name-a11-i12
        const match = imagePath.match(/&\w+_(\w+)-a\d+-i\d+/);
        return match ? match[1] : "unknown"; // Return the name or 'unknown' if not found
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

    return (
        <main className="adventure-wrapper">
            {/* Welcome Modal */}
            <Modal
                className="welcome-modal"
                isOpen={showWelcomeModal}
                title="Welcome to Adventure Game"
                details="Defeat all the enemies to win!"
                buttons={welcomeModalButtons}
            />

            {/* Game Content */}
            {gameStarted && (
                <section className="adventure-platform">
                    <div className="platform-indicator">
                        {simulationDetails.simulationDetails?.name}
                    </div>
                    <p>Lives: {lives}</p>

                    <section className="enemy-track">
                        {enemies.map((enemy, enemyIndex) => {
                            const enemyName = extractEnemyName(enemy.imagePath);

                            return (
                                <div
                                    key={enemyIndex}
                                    className="enemy-track-list"
                                >
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
                                        <img
                                            src={`/assets/images/sprite/profile-${enemyName}.png`}
                                            alt={enemyName}
                                        />
                                    </div>
                                    {enemy.words.map(
                                        (word: any, wordIndex: any) => (
                                            <React.Fragment key={wordIndex}>
                                                <div className="enemy-connector"></div>
                                                <div
                                                    className={`enemy-word ${
                                                        spelledWords[
                                                            enemyIndex
                                                        ]?.[wordIndex]
                                                            ? "spelled"
                                                            : ""
                                                    }`}
                                                ></div>
                                            </React.Fragment>
                                        )
                                    )}
                                </div>
                            );
                        })}
                    </section>

                    <section className="sprite-holder">
                        {/* Character Sprite */}
                        <section
                            className={`character-container ${characterAttackType} ${characterHit}`}
                        >
                            <div
                                className={`character-sprite ${
                                    isCharacterAttacking
                                        ? `attack-${characterDetails.name}`
                                        : `idle-${characterDetails.name}`
                                }`}
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    backgroundImage: `url("/assets/images/sprite/${characterDetails.name}.png")`,
                                    width: `360px`,
                                    height: `360px`,
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

                        {/* Enemy Sprite */}
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
                                    backgroundImage: `url("/assets/images/sprite/${enemyDetails.name}.png")`,
                                    width: `360px`,
                                    height: `360px`,
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
                            </div>
                        </section>
                    </section>
                </section>
            )}

            {/* Confirmation Modal */}
            {gameStarted && (
                <section className="adventure-control">
                    <img src="/assets/images/background/bg-border_large.webp" />
                    <Modal
                        className="confirmation-modal"
                        isOpen={showConfirmationModal}
                        title="Confirm Item Use"
                        details={`Are you sure you want to use ${itemToUse?.name}?`}
                        buttons={[
                            <button key="confirm" onClick={confirmUseItem}>
                                Yes, Use Item
                            </button>,
                            <button key="cancel" onClick={cancelUseItem}>
                                Cancel
                            </button>,
                        ]}
                    />

                    {/* Render items */}

                    <section
                        className={`control-item ${
                            isItemLocked ? "item-locked" : "item-unlocked"
                        }`}
                    >
                        <img
                            className={
                                isItemLocked ? "img-locked" : "img-unlocked"
                            }
                            src={
                                isItemLocked
                                    ? "/assets/images/background/bg-item-locked.png"
                                    : "/assets/images/background/bg-item-unlocked.png"
                            }
                            alt={isItemLocked ? "Locked" : "Unlocked"}
                        />

                        {userItems.length > 0 ? (
                            userItems.map((userItem) => (
                                <div
                                    key={userItem.userItemID}
                                    className="item-box"
                                    onClick={() =>
                                        handleUseItem(
                                            userItem.itemID.itemID,
                                            userItem.itemID.name
                                        )
                                    }
                                >
                                    <img
                                        src={`/assets/images/reward/${userItem.itemID.imagePath}`}
                                        alt={userItem.itemID.name}
                                    />
                                    <span>{userItem.quantity}x</span>
                                </div>
                            ))
                        ) : (
                            <p>No items available</p>
                        )}
                    </section>

                    <section className="control-input">
                        <form onSubmit={handleSubmit}>
                            {simulationDetails.simulationDetails
                                ?.simulationType === "Syllable" ? (
                                <>
                                    <p className="syllable-word">
                                        {currentWord}
                                    </p>
                                    <input
                                        className="syllable-range"
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={rangeValue}
                                        onChange={handleRangeChange}
                                    />
                                    <span className="range-value">
                                        {rangeValue}
                                    </span>
                                    <button type="submit">Go!</button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={word?.playAudio}
                                    >
                                        🔉
                                    </button>
                                    <InputBox
                                        type="text"
                                        value={typedWord}
                                        onChange={handleInputChange}
                                        placeholder="Type the word..."
                                        required
                                    />

                                    <button type="submit">Go!</button>
                                </>
                            )}
                        </form>
                    </section>

                    <section className="control-clue">
                        <h1>Word's Info</h1>

                        <section className="clue-container">
                            <span>Pronunciation</span>
                            <div className="clue-pronunciation ">
                                <span className={`${lockedPronunciation}`}>
                                    {word?.pronunciation}
                                </span>
                            </div>

                            <span>Definition</span>
                            <div className="clue-definition">
                                <span className={`${lockedDefinition}`}>
                                    {word?.definition}
                                </span>
                            </div>
                        </section>
                    </section>
                </section>
            )}

            {/* Game Over Modal */}
            <Modal
                className="game-over-modal"
                isOpen={showGameOverModal}
                title="Game Over"
                details="Unfortunately, you have run out of lives. Would you like to restart the game?"
                buttons={[
                    <button key="restart" onClick={handleGameOverRestart}>
                        Restart Game
                    </button>,
                    <button
                        key="exit"
                        onClick={() =>
                            (window.location.href = "/tower/spelling")
                        }
                    >
                        Exit to Main Menu
                    </button>,
                ]}
            />

            <ConfettiWrapper showConfetti={showConfetti} />

            <Modal
                className="conquer-floor-modal"
                isOpen={showConquerFloorModal}
                title="Floor Conquered!"
                details="Congratulations! You've conquered this floor. Would you like to proceed to the next floor or return to the main menu?"
                buttons={[
                    <button
                        key="menu"
                        onClick={() => (window.location.href = "/student-room")}
                    >
                        Return to Main Menu
                    </button>,
                ]}
            />
        </main>
    );
};

export default SimulationGameplay;
