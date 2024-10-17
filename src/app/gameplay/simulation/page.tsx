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
import ConfettiWrapper from "@/app/component/Confetti/Confetti";
import useSimulationDetails from "@/hook/useSimulationDetails";
import useTimer from "@/util/timer";
import { useAuthStore } from "@/store/authStore";
import useFetchSimulationWords from "@/hook/useSimulationWord";
import useCountdown from "@/hook/useCountDown";
import StudentWordProgress from "@/app/(navigation)/student-word-progress/page";
import useUpdateSimulationProgress from "@/hook/useUpdateSimulationProgress";
import updateSimulationProgress from "@/lib/assessment-endpoint/updateSimulationProgress";
import useStudentWordProgress from "@/hook/useStudentWordProgress";
import viewSimulationParticipants from "@/lib/simulation-endpoint/viewSimulationParticipants";
import updateParticipantAssessment from "@/lib/assessment-endpoint/updateParticipantAssessment";
import { FaSignOutAlt, FaVolumeUp } from "react-icons/fa";
import { useRouter } from "next/navigation";

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

interface SimulationWordsArray {
    simulationWordsID: number;
    creatorID: number;
    word: string;
    silentIndex: string; // Keeping silentIndex as string
}

export interface SimulationEnemy {
    simulationEnemyID: number;
    imagePath: string;
    words: number[]; // Array of numbers
}

const SimulationGameplay = () => {
    const { userID } = useAuthStore.getState();
    const searchParams = useSearchParams();

    const simulationIDParam = searchParams.get("simulationID");
    const simulationID = simulationIDParam
        ? parseInt(simulationIDParam, 10)
        : NaN;
    // const [loading, setLoading] = useState<boolean>(true);
    const attackIntervalParam = searchParams.get("attackInterval");
    const attackInterval = attackIntervalParam
        ? parseInt(attackIntervalParam, 10)
        : NaN;

    const enemyInterval = useCountdown(attackInterval);
    const simulationDetails = useSimulationDetails(simulationID);
    const studentLife = simulationDetails?.simulationDetails?.studentLife ?? 0;
    const [lives, setLives] = useState<number>(studentLife);

    const interval = simulationDetails?.simulationDetails?.attackInterval ?? 0;
    const [timeLeft, setTimeLeft] = useState<number>(interval);
    const [score, setScore] = useState(100);

    const [finalScore, setFinalScore] = useState(0);

    const router = useRouter();

    const subtractScore = (amount: number) => {
        setScore((prevScore) => Math.max(prevScore - amount, 0)); // Ensure lives don't go below 0
    };
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

    const gameType = simulationDetails.simulationDetails?.simulationType;

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
                        subtractScore(score * 0.02);
                        break;
                    case "Medical Kit":
                        addLives(3);
                        subtractScore(score * 0.02);

                        break;
                    case "Unusual Battery":
                        setIsPronunciationLocked(false);
                        subtractScore(score * 0.02);

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
    const [showExitModal, setShowExitModal] = useState<boolean>(false);

    const handleExitModal = () => {
        setShowExitModal(true);
    };

    const handleCancelExitModal = () => {
        setShowExitModal(false);
    };

    const handleGameOverRestart = () => {
        // Logic to restart the game
        console.log("Restarting game...");
        setShowGameOverModal(false);
        window.location.reload();

        // Add additional logic here to reset the game state
    };

    const [enemies, setEnemies] = useState<SimulationEnemy[]>([]);

    useEffect(() => {
        if (simulationDetails) {
            setEnemies(simulationDetails.simulationDetails?.enemy || []);
        }
    }, [gameStarted, enemies]);

    const [currentEnemyIndex, setCurrentEnemyIndex] = useState<number>(0);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [typedWord, setTypedWord] = useState<string>("");

    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
    const [spelledWords, setSpelledWords] = useState<Record<number, boolean[]>>(
        {}
    );
    const [showConfetti, setShowConfetti] = useState<boolean>(false); // State for showing confetti
    const [defeatedEnemies, setDefeatedEnemies] = useState<number[]>([]);

    const [total, setTotal] = useState(0);
    useEffect(() => {
        if (enemies.length > 0) {
            const initialSpelledWords: Record<number, boolean[]> = {};
            let totalWords = 0; // Variable to store the total count of words

            enemies.forEach((enemy, index) => {
                initialSpelledWords[index] = new Array(enemy.words.length).fill(
                    false
                );
                totalWords += enemy.words.length; // Add the number of words for each enemy to the total count
                setTotal(total);
            });

            setSpelledWords(initialSpelledWords);
            console.log("Enemies", enemies);
            console.log("Initial", initialSpelledWords);
            console.log("Total words", totalWords); // Log the total count of words
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
    const characterDetails = useImageParse("&range_cannon-a22-i17");
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
    const currentWordID = currentEnemy?.words[currentWordIndex];
    const simuWord = useFetchSimulationWords(currentWordID);
    const currentWord = simuWord.word;
    const word = useMerriam(currentWord || ""); // Pass the currentWord to the custom hook
    const silentIndex = simuWord.silentIndex;
    const studentWordProgress = useStudentWordProgress(
        simulationID,
        userID,
        currentWordID
    );

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<string>(""); // Start with empty string

    useEffect(() => {
        if (word?.word) {
            setSelectedIndex("0".repeat(word.word.length)); // Set to "00000" based on word length
        }
    }, [word]); // Runs when 'word' changes

    const handleClick = (index: number): void => {
        setSelectedIndices((prevSelectedIndices) => {
            const newSelection = prevSelectedIndices.includes(index)
                ? prevSelectedIndices.filter((i) => i !== index) // Unselect if already selected
                : [...prevSelectedIndices, index]; // Select the letter

            const selectionString = word?.word
                ? word.word
                      .split("")
                      .map((_, i) => (newSelection.includes(i) ? "1" : "0"))
                      .join("")
                : ""; // Fallback to empty string

            console.log("Selection string:", selectionString);
            setSelectedIndex(selectionString);

            return newSelection;
        });
    };

    const clearSelections = (): void => {
        setSelectedIndices([]);
    };

    useEffect(() => {
        console.log("Simu Details", silentIndex);
    }, [currentWord]);
    const [isLastEnemy, setIsLastEnemy] = useState(false);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTypedWord(event.target.value);
    };

    const [isLastEnemyWord, setIsLastEnemyWord] = useState(false);

    const handleEnemyAttack = () => {
        if (enemyDetails.attackType == "melee") {
            setEnemyAttackType("expand-width");
            console.log("Enemy is Melee");

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
                    if (lives === 1 && isEndLive === true) {
                        // setShowGameOverModal(true);
                    }
                }, 500);

                // Set character hit to "" after the hit duration
                setTimeout(() => {
                    setEnemyAttackType("shrink-width");

                    setCharacterHit("");
                    setIsButtonDisabled(false);
                    enemyInterval.start();
                }, 500); // 500ms is the duration of the hit
            }, (enemyDetails.attackFrame / 12) * 1000 + 800); // Main enemy attack duration
        } else {
            setIsEnemyAttacking(true);
            console.log("Enemy is Range");

            setTimeout(() => {
                setIsEnemyAttacking(false);
                setCharacterHit("hit");
                subtractLives(1);
                setCharacterAttackType("");

                // Set character hit to "" after the hit duration
                setTimeout(() => {
                    setCharacterHit("");
                    setIsButtonDisabled(false);
                    enemyInterval.start();
                }, 500); // 500ms is the duration of the hit
            }, (enemyDetails.attackFrame / 12) * 1000); // Main enemy attack duration for non-melee
        }
    };

    const handleCharacterAttack = () => {
        if (characterDetails.attackType == "melee") {
            setCharacterAttackType("expand-width");
            console.log("Attack is Melee");

            setTimeout(() => {
                setIsCharacterAttacking(true);
            }, 500);

            setTimeout(() => {
                setIsCharacterAttacking(false);
                setCharacterAttackType("shrink-width");
                setEnemyAttackType("");
                setIsButtonDisabled(false);
                setEnemyHit("hit");

                // Set character hit to "" after the hit duration
                setTimeout(() => {
                    setEnemyHit("");
                }, 500); // 500ms is the duration of the hit
            }, (characterDetails.attackFrame / 12) * 1000); // Main enemy attack duration
        } else {
            console.log("Attack is Range");

            setIsCharacterAttacking(true);

            setTimeout(() => {
                setIsCharacterAttacking(false);
                setEnemyAttackType("");

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
            console.log("Missed Melee Attack");
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
            console.log("Missed Range Attack");
            setIsCharacterAttacking(true);

            setTimeout(() => {
                setIsCharacterAttacking(false);
            }, (characterDetails.attackFrame / 12) * 1000); // Main enemy attack duration for non-melee
        }
    };
    const time = useTimer();

    const [isEndLive, setIsEndLive] = useState(false);

    const [mistakes, setMistakes] = useState(0);
    const incrementMistake = () => {
        setMistakes((prevMistakes) => prevMistakes + 1);
        subtractScore(score * 0.05);
    };

    const [totalItems, setTotalItems] = useState(0);

    const incrementTotalItem = () => {
        setTotalItems((prevTotalItems) => prevTotalItems + 1);
    };

    const handleTimesUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentEnemy = enemies[currentEnemyIndex];
        incrementMistake();

        if (!currentEnemy) {
            console.error("Current enemy is undefined");
            return;
        }

        const isLastWord = currentWordIndex === currentEnemy.words.length - 1;
        const isLastEnemy = currentEnemyIndex === enemies.length - 1;
        setIsLastEnemy(isLastEnemy);

        if (enemyInterval.time === 0 && lives >= 2 && isLastEnemy) {
            console.log("Enemy Attack!!!");
            handleEnemyAttack();
            setTimeout(() => {
                console.log("Reset Time");
                enemyInterval.reset();
            }, (characterDetails.attackFrame / 12) * 2000);

            setTimeout(() => {
                console.log("Starts the countdown");
                enemyInterval.start();
            }, (characterDetails.attackFrame / 12) * 2500);
        }

        if (
            enemyInterval.time === 0 &&
            lives >= 2 &&
            !(isLastEnemy && isLastWord)
        ) {
            console.log("Enemy Attack!!!");
            handleEnemyAttack();
            setTimeout(() => {
                console.log("Reset Time");
                enemyInterval.reset();
            }, (characterDetails.attackFrame / 12) * 2000);

            setTimeout(() => {
                console.log("Starts the countdown");
                enemyInterval.start();
            }, (characterDetails.attackFrame / 12) * 2500);
        }

        // Check if the time is up and lives are 1
        if (
            enemyInterval.time === 0 &&
            lives === 1 &&
            !(isLastEnemy && isLastWord)
        ) {
            console.log("Time to switch word");
            handleEnemyAttack();

            // Prepare to move to the next enemy or word
            setTypedWord("");

            const updatedStudentProgress = {
                studentWordProgressID:
                    studentWordProgress.wordProgress.studentWordProgressID,
                simulationWordsID: currentWordID,
                studentID: userID,
                correct: false,
                score: 0,
                duration: time.getFormattedTimeInSeconds(),
                accuracy: 0,
                mistake: mistakes + 1,
            };

            console.log(updatedStudentProgress);

            updateSimulationProgress(updatedStudentProgress);
            setMistakes(0);
            time.reset();

            // setTimeout(() => {
            //   const updatedSpelledWords = { ...spelledWords };
            //   updatedSpelledWords[currentEnemyIndex][currentWordIndex] = true;
            //   setSpelledWords(updatedSpelledWords);
            // }, (characterDetails.attackFrame / 12) * 2000);

            setTimeout(() => {
                enemyInterval.reset();
                setLives(studentLife);
                setTimeLeft(interval);
                setCurrentWordIndex(currentWordIndex + 1); // Move to next word
                setIsPronunciationLocked(true);
            }, (characterDetails.attackFrame / 12) * 2500);
        }

        if (
            enemyInterval.time === 0 &&
            lives === 1 &&
            isLastWord &&
            isLastEnemy
        ) {
            // Last word of the last enemy
            setIsLastEnemyWord(true);
            setIsLastEnemy(true);
            setLives(0);

            updateParticipantAssessment(userID, simulationID)
                .then((score) => {
                    console.log("Score:", score.data.score);
                    setFinalScore(score.data.score);
                    setTimeout(() => {
                        setShowConfetti(true);
                        setShowConquerFloorModal(true);
                    }, (characterDetails.attackFrame / 12) * 1000);
                })
                .catch((error) => {
                    console.error(
                        "Error updating participant assessment:",
                        error
                    );
                });
            //enemyInterval.reset(0);
        }

        console.log(isLastWord);
        console.log(enemyInterval);
        console.log(lives);
        console.log(currentWordIndex);

        if (isLastWord && enemyInterval.time === 0 && lives === 1) {
            // Last word of current enemy but not the last enemy

            console.log(currentEnemyIndex);
            console.log(currentWordIndex);

            setIsLastEnemyWord(true);
            setDefeatedEnemies((prevDefeatedEnemies) => [
                ...prevDefeatedEnemies,
                currentEnemyIndex,
            ]);

            setTimeout(() => {
                enemyInterval.reset();
                setLives(studentLife);
                setTimeLeft(interval);
                setCurrentEnemyIndex(currentEnemyIndex + 1); // Move to next enemy
                setCurrentWordIndex(0); // Reset word index
                setIsPronunciationLocked(true);
            }, (characterDetails.attackFrame / 12) * 2500);
            setIsLastEnemyWord(false);
        }
        time.reset();
    };

    useEffect(() => {
        if (lives === 0 && timeLeft !== 0) {
            console.log("hurot");
            setTimeout(() => {
                console.log("Start nako", currentEnemyIndex);
                setLives(studentLife);
                enemyInterval.reset();
                console.log(
                    `Proceeding to next word: Word ${currentWordIndex + 1}`
                );
                setIsPronunciationLocked(true);
            }, (characterDetails.attackFrame / 12) * 1500);
        }
    });

    const handleDummySubmit = async () => {
        const dummyEvent = {
            preventDefault: () => {},
        } as React.FormEvent<HTMLFormElement>;

        await handleTimesUp(dummyEvent);
    };

    useEffect(() => {
        const submitAndResetInterval = async () => {
            await handleDummySubmit();
        };

        if (enemyInterval.time === 0) {
            submitAndResetInterval();
        }
    }, [enemyInterval.time, enemyDetails.attackFrame]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsButtonDisabled(true);
        const currentEnemy = enemies[currentEnemyIndex];
        enemyInterval.pause();

        // Check if the current word is the last one for this enemy
        const isLastWord = currentWordIndex === currentEnemy.words.length - 1;
        // Check if the current enemy is the last one
        const isLastEnemy = currentEnemyIndex === enemies.length - 1;

        const currentWordID = currentEnemy?.words[currentWordIndex];
        // const simuWord = useFetchSimulationWords(currentWordID);
        const currentWord = simuWord.word?.toLowerCase();

        console.log(
            `Submitting: Enemy ${currentEnemyIndex + 1}/${enemies.length}`
        );
        console.log(
            `Word ${currentWordIndex + 1}/${
                currentEnemy.words.length
            }: ${typedWord.toLowerCase()}`
        );
        console.log(`Current word to match: ${currentWord}`);

        const checkGameType =
            gameType === "Spelling"
                ? typedWord.toLowerCase() === currentWord
                : rangeValue === word?.syllable;

        console.log("Gametype", gameType);
        console.log("Silent Index", silentIndex);
        console.log("Selected Index", selectedIndex);

        // Check if the current word matches the expected word or syllable
        if (
            (gameType === "Spelling" &&
                typedWord.toLowerCase() === currentWord) ||
            (gameType === "Syllable" && rangeValue === word?.syllable) ||
            (gameType === "Silent" && silentIndex === selectedIndex)
        ) {
            console.log(typedWord);
            console.log(currentWord);
            // Correct word spelling
            incrementTotalItem();
            console.log("Correct word entered.");
            enemyInterval.pause();

            const studentID = userID;
            const numberOfAttempts = mistakes;

            const accuracy = ((studentLife - mistakes) / studentLife) * 100;

            const updatedStudentProgress = {
                studentWordProgressID:
                    studentWordProgress.wordProgress.studentWordProgressID,
                simulationWordsID: currentWordID,
                studentID: userID,
                correct: true,
                score: score,
                duration: time.getFormattedTimeInSeconds(),
                accuracy: accuracy,
                mistake: mistakes,
            };

            console.log(updatedStudentProgress);

            updateSimulationProgress(updatedStudentProgress);

            setTypedWord("");
            handleCharacterAttack();

            const updatedSpelledWords = { ...spelledWords };
            updatedSpelledWords[currentEnemyIndex][currentWordIndex] = true;
            setSpelledWords(updatedSpelledWords);

            // Prepare progress data

            setTimeout(() => {
                clearSelections;
                setIsCharacterAttacking(false);
                setLives(studentLife);
                enemyInterval.reset();

                if (isLastWord && isLastEnemy) {
                    // Last word of the last enemy
                    setIsLastEnemy(true);
                    setIsLastEnemyWord(true);
                    setLives(0);

                    console.log("Last word of the last enemy.");
                    setDefeatedEnemies((prevDefeatedEnemies) => [
                        ...prevDefeatedEnemies,
                        currentEnemyIndex,
                    ]);

                    updateParticipantAssessment(userID, simulationID)
                        .then((score) => {
                            console.log("Score:", score.data.score);
                            setFinalScore(score.data.score);
                            setTimeout(() => {
                                setShowConfetti(true);
                                setShowConquerFloorModal(true);
                            }, (characterDetails.attackFrame / 12) * 1000);
                        })
                        .catch((error) => {
                            console.error(
                                "Error updating participant assessment:",
                                error
                            );
                        });
                    enemyInterval.reset(0);
                } else if (isLastWord) {
                    // Last word of current enemy but not the last enemy
                    setIsLastEnemyWord(true);
                    console.log("Last word for this enemy.");
                    setDefeatedEnemies((prevDefeatedEnemies) => [
                        ...prevDefeatedEnemies,
                        currentEnemyIndex,
                    ]);
                    enemyInterval.reset();
                    setTimeLeft(interval);
                    setCurrentEnemyIndex(currentEnemyIndex + 1);
                    setCurrentWordIndex(0);
                    setIsPronunciationLocked(true);
                    setIsLastEnemyWord(false);
                } else {
                    console.log(
                        `Proceeding to next word: Word ${currentWordIndex + 1}`
                    );
                    setTimeLeft(interval);
                    setCurrentWordIndex(currentWordIndex + 1);
                    setIsPronunciationLocked(true);
                }
            }, (characterDetails.attackFrame / 12) * 1000); // Adjust timing as needed
            setMistakes(0);
            time.reset();
        } else {
            incrementMistake();
            console.log("Incorrect word entered.");
            const updatedStudentProgress = {
                studentWordProgressID:
                    studentWordProgress.wordProgress.studentWordProgressID,
                simulationWordsID: currentWordID,
                studentID: userID,
                correct: false,
                score: 0,
                duration: time.getFormattedTimeInSeconds(),
                accuracy: 0,
                mistake: mistakes + 1,
            };

            console.log(updatedStudentProgress);

            updateSimulationProgress(updatedStudentProgress);

            handleMissedAttack();

            setTimeout(() => {
                enemyInterval.reset();
                handleEnemyAttack();

                if (isLastWord && isLastEnemy && lives === 1) {
                    setIsLastEnemyWord(true);
                    setIsLastEnemy(true);
                    updateParticipantAssessment(userID, simulationID)
                        .then((score) => {
                            console.log("Score:", score.data.score);
                            setFinalScore(score.data.score);
                            setTimeout(() => {
                                setShowConfetti(true);
                                setShowConquerFloorModal(true);
                            }, (characterDetails.attackFrame / 12) * 1000);
                        })
                        .catch((error) => {
                            console.error(
                                "Error updating participant assessment:",
                                error
                            );
                        });
                    enemyInterval.reset(0);
                } else if (isLastWord && lives === 1) {
                    setIsLastEnemyWord(true);
                    setDefeatedEnemies((prevDefeatedEnemies) => [
                        ...prevDefeatedEnemies,
                        currentEnemyIndex,
                    ]);
                    setTimeout(() => {
                        enemyInterval.reset();
                        setLives(studentLife);
                        setTimeLeft(interval);
                        setCurrentEnemyIndex(currentEnemyIndex + 1);
                        setCurrentWordIndex(0);
                    }, (characterDetails.attackFrame / 12) * 3000);
                    setIsLastEnemyWord(false);
                } else if (lives === 1) {
                    setTimeout(() => {
                        enemyInterval.reset();
                        setLives(studentLife);
                        setTimeLeft(interval);
                        setCurrentWordIndex(currentWordIndex + 1);
                        setIsPronunciationLocked(true);
                    }, (characterDetails.attackFrame / 12) * 2500);
                }
            }, (characterDetails.attackFrame / 12) * 2000);
            setMistakes(0);
            time.reset();
        }
    };

    //Play only the audio in gameType 1

    useEffect(() => {
        if (gameStarted && word && word.playAudio) {
            // Play audio on word change
            const timer = setTimeout(() => {
                word.playAudio();
                setIsButtonDisabled(false);
            }, 1000);

            setTimeout(() => {
                console.log("audio ends");
                enemyInterval.start();
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

    const [rangeValue, setRangeValue] = useState(1);

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
            <div className="game-exit">
                <FaSignOutAlt onClick={handleExitModal} />
            </div>

            {/* Welcome Modal */}
            <Modal
                className="welcome-modal"
                isOpen={showWelcomeModal}
                title={`Welcome to  ${simulationDetails.simulationDetails?.name}`}
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
                    <p>Time: {enemyInterval.time}</p>
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
                        className="item-used-modal"
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
                                    <button
                                        type="submit"
                                        disabled={isButtonDisabled}
                                    >
                                        Go!
                                    </button>
                                </>
                            ) : simulationDetails.simulationDetails
                                  ?.simulationType === "Spelling" ? (
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

                                    <button
                                        type="submit"
                                        disabled={isButtonDisabled}
                                    >
                                        Go!
                                    </button>
                                </>
                            ) : gameType === "Silent" ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={word?.playAudio}
                                    >
                                        <FaVolumeUp />
                                    </button>

                                    <section className="silent-container">
                                        {word?.word
                                            .split("")
                                            .map(
                                                (
                                                    letter: string,
                                                    index: number
                                                ) => (
                                                    <div
                                                        key={index}
                                                        onClick={() =>
                                                            handleClick(index)
                                                        }
                                                        className={`silent-index ${
                                                            selectedIndices.includes(
                                                                index
                                                            )
                                                                ? "selected"
                                                                : "unselected"
                                                        }`}
                                                    >
                                                        {letter}
                                                    </div>
                                                )
                                            )}
                                    </section>

                                    <button
                                        type="submit"
                                        disabled={isButtonDisabled}
                                    >
                                        Go!
                                    </button>
                                </>
                            ) : null}
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
                className="gameover-modal"
                isOpen={showGameOverModal}
                title="Simulation FAILED!"
                details="Unfortunately, your grade is below 60%"
                buttons={[
                    <button
                        key="exit"
                        onClick={() => (window.location.href = "/dashboard")}
                    >
                        Exit to Main Menu
                    </button>,
                ]}
            />

            <Modal
                className="logout-modal"
                isOpen={showExitModal}
                title="Confirm Exit"
                onClose={handleGameOverRestart}
                details="Are you sure you want to leave?"
                buttons={[
                    <button key="exit" onClick={() => router.back()}>
                        Exit
                    </button>,
                    <button key="cancel" onClick={handleCancelExitModal}>
                        Cancel
                    </button>,
                ]}
            />

            <ConfettiWrapper showConfetti={showConfetti} />

            <Modal
                className="conquer-floor-modal"
                isOpen={showConquerFloorModal}
                title="Simulation Done!"
                details={`Congratulations! You've completed this Simulation with the score of ${finalScore} `}
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
