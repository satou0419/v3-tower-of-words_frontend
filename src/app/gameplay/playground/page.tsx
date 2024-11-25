"use client"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { InputBox } from "@/app/component/Input/Input"
import { useEnemyStore } from "@/store/enemyStore"
import Loading from "@/app/loading"
import useImageParse from "@/hook/useImageParse"
import "./adventure.scss" // Make sure your SCSS file is imported correctly
import "./animation.scss"
import Modal from "@/app/component/Modal/Modal"
import useAnimationKeyframes from "@/hook/useAnimationKeyframes"
import "./modals.scss"
import useMerriam from "@/hook/useMerriam"
import useAddWord from "@/hook/useAddWord" // Import the custom hook
import useProgressEquippedStore from "@/store/progressEquippedStore"
import getUserDetails from "@/lib/user-endpoint/getUserDetails"
import useUpdateProgress from "@/hook/useUpdateProgress"
import useRedeemReward from "@/hook/useRedeemReward"
import { useGameplayStore } from "@/store/gameplayStore"
import useIncrementFloor from "@/hook/useIncrementFloor"
import { FaSignOutAlt, FaVolumeUp } from "react-icons/fa"
import useRandomEnemy from "@/hook/useRandomEnemy"
import useRandomWord from "@/hook/useRandomWord"
import useRewardCredit from "@/hook/useRewardCredit"

interface Item {
    itemID: number
    name: string
    imagePath: string
    description: string
    price: number
}

interface UserItem {
    userItemID: number
    quantity: number
    userID: number
    itemID: Item
}

const PlaygroundGameplay = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true) // State for showing welcome modal
    const [gameStarted, setGameStarted] = useState<boolean>(false) // State for tracking game start
    const [isItemLocked] = useState(true)

    const [showConquerFloorModal, setShowConquerFloorModal] = useState(false)
    const {
        randomWord,
        loading: wordLoading,
        refresh: refreshWord,
    } = useRandomWord()
    const {
        enemy,
        loading: enemyLoading,
        refetch: refetchEnemy,
    } = useRandomEnemy()

    useEffect(() => {
        if (!enemyLoading && !wordLoading) {
            setLoading(false)
        }
    }, [enemyLoading, wordLoading])

    //#region Button state
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [userItems, setUserItems] = useState<UserItem[]>([])

    //#region Extracts data from URL
    const searchParams = useSearchParams()
    const gameType = searchParams.get("gameType")

    //#endRegion

    const [showGameOverModal, setShowGameOverModal] = useState<boolean>(false)
    const [showExitModal, setShowExitModal] = useState<boolean>(false)

    // Handler for restarting the game
    const handleGameOverRestart = () => {
        // Logic to restart the game
        console.log("Restarting game...")
        setShowGameOverModal(false)
        window.location.reload()

        // Add additional logic here to reset the game state
    }

    const { enemies, fetchEnemies } = useEnemyStore()
    const [enemyData, setEnemyData] = useState<any[]>([])
    const [currentEnemyIndex, setCurrentEnemyIndex] = useState<number>(0)
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0)
    const [typedWord, setTypedWord] = useState<string>("")

    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false)
    const [spelledWords, setSpelledWords] = useState<Record<number, boolean[]>>(
        {}
    )

    const { awardCredit } = useRewardCredit()

    const {
        addWord,
        isLoading: isAddingWord,
        error: addWordError,
    } = useAddWord()

    const handleExitModal = () => {
        setShowExitModal(true)
    }

    const handleCancelExitModal = () => {
        setShowExitModal(false)
    }

    useEffect(() => {
        if (enemies.length > 0) {
            setEnemyData(enemies)
            setLoading(false)
            const initialSpelledWords: Record<number, boolean[]> = {}
            enemies.forEach((enemy, index) => {
                initialSpelledWords[index] = new Array(enemy.words.length).fill(
                    false
                )
            })
            setSpelledWords(initialSpelledWords)
            console.log("Enemy Data", enemyData)
        }
    }, [enemies])

    const [isCharacterAttacking, setIsCharacterAttacking] =
        useState<boolean>(false)
    const [isEnemyAttacking, setIsEnemyAttacking] = useState<boolean>(false)
    const [characterAttackType, setCharacterAttackType] = useState("")
    const [enemyAttackType, setEnemyAttackType] = useState("")
    const [enemyHit, setEnemyHit] = useState("")
    const [characterHit, setCharacterHit] = useState("")

    const userEquipped = useProgressEquippedStore(
        (state) => state.progressEquipped
    )

    useEffect(() => {
        getUserDetails()
    }, [])
    const characterDetails = useImageParse(userEquipped.equippedCharacter)
    const enemyDetails = useImageParse(enemy || "")

    useEffect(() => {
        if (characterDetails.name) {
            const characterImage = new Image()
            characterImage.src = `/assets/images/sprite/${characterDetails.name}.png`
            characterImage.onload = () => setImagesLoaded(true)
        }
    }, [characterDetails.name])

    const characterAnimation = useAnimationKeyframes(
        isCharacterAttacking ? "attack" : "idle",
        characterDetails.name,
        characterDetails.idleFrame,
        characterDetails.attackFrame
    )

    const enemyAnimation = useAnimationKeyframes(
        isEnemyAttacking ? "attack" : "idle",
        enemyDetails.name,
        enemyDetails.idleFrame,
        enemyDetails.attackFrame
    )

    const currentWord = randomWord || ""
    const word = useMerriam(currentWord) // Pass the currentWord to the custom hook

    console.log(word?.id)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTypedWord(event.target.value)
    }

    const handleEnemyAttack = () => {
        setCharacterAttackType("")

        if (enemyDetails.attackType == "melee") {
            setEnemyAttackType("expand-width")

            setTimeout(() => {
                setIsEnemyAttacking(true)
                // playEnemyAttackSound(); // Play the attack sound when the enemy attacks
            }, 800)

            setTimeout(() => {
                setIsEnemyAttacking(false)
                setCharacterHit("hit")
                // subtractLives(1) // Subtract 1 from lives on incorrect input

                setCharacterAttackType("")

                setTimeout(() => {
                    if (lives === 1) {
                        setShowGameOverModal(true)
                    }
                }, 500)

                // Set character hit to "" after the hit duration
                setTimeout(() => {
                    setEnemyAttackType("shrink-width")

                    setTimeout(() => {
                        subtractLives(1)

                        setIsButtonDisabled(false)
                    }, (enemyDetails.attackFrame / 12) * 1000)
                    setCharacterHit("")
                }, 500) // 500ms is the duration of the hit
            }, (enemyDetails.attackFrame / 12) * 1000 + 800) // Main enemy attack duration
        } else {
            setIsEnemyAttacking(true)
            subtractLives(1)

            setTimeout(() => {
                setIsEnemyAttacking(false)
                setCharacterHit("hit")

                // Set character hit to "" after the hit duration
                setTimeout(() => {
                    setCharacterHit("")
                }, 500) // 500ms is the duration of the hit
            }, (enemyDetails.attackFrame / 12) * 1000) // Main enemy attack duration for non-melee
        }
    }

    const handleCharacterAttack = () => {
        if (characterDetails.attackType == "melee") {
            setCharacterAttackType("expand-width")

            setTimeout(() => {
                setIsCharacterAttacking(true)
            }, 500)

            setTimeout(() => {
                setIsCharacterAttacking(false)
                setCharacterAttackType("shrink-width")
                setEnemyAttackType("")

                setTimeout(() => {
                    if (gameType === "syllable") {
                        setIsButtonDisabled(false)
                    }
                }, (characterDetails.attackFrame / 12) * 1200)
                setEnemyHit("hit")

                // Set character hit to "" after the hit duration
                setTimeout(() => {
                    setEnemyHit("")
                    refetchEnemy()
                    refreshWord()
                }, 1500) // 500ms is the duration of the hit
            }, (characterDetails.attackFrame / 12) * 1000) // Main enemy attack duration
        } else {
            setIsCharacterAttacking(true)

            setTimeout(() => {
                setIsCharacterAttacking(false)
                setEnemyHit("hit")

                // Set character hit to "" after the hit duration
                setTimeout(() => {
                    setEnemyHit("")
                }, 500) // 500ms is the duration of the hit
            }, (characterDetails.attackFrame / 12) * 1000) // Main enemy attack duration for non-melee
        }
    }

    const handleMissedAttack = () => {
        if (characterDetails.attackType == "melee") {
            setCharacterAttackType("expand-width")
            setTimeout(() => {
                setIsCharacterAttacking(true)
            }, 500)

            setTimeout(() => {
                setIsCharacterAttacking(false)
                setCharacterAttackType("shrink-width")
                setEnemyAttackType("")
            }, (characterDetails.attackFrame / 12) * 1000)
        } else {
            setIsCharacterAttacking(true)

            setTimeout(() => {
                setIsCharacterAttacking(false)
            }, (characterDetails.attackFrame / 12) * 1000) // Main enemy attack duration for non-melee
        }
    }
    const { lives, subtractLives, addLives } = useGameplayStore()
    // Other state and hooks...
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsButtonDisabled(true)

        const currentWord = word?.id
        // Handle the game logic for correct answers
        if (
            typedWord.toLowerCase() === currentWord ||
            rangeValue === word?.syllable
        ) {
            // Correct word spelling

            addWord(currentWord || "")
            awardCredit(2)
            handleCharacterAttack()

            setTimeout(() => {
                setIsCharacterAttacking(false)
                if (gameType === "syllable") setRangeValue(1)
            }, (characterDetails.attackFrame / 12) * 1000) // Adjust timing as needed
        } else {
            // Check if lives have reached 0

            console.log("Missed attacked!!!")

            handleMissedAttack()
            setTimeout(() => {
                handleEnemyAttack()
            }, (characterDetails.attackFrame / 12) * 2000)
        }
    }

    //Play only the audio in gameType 1

    useEffect(() => {
        if (gameStarted && word && word.playAudio) {
            // Play audio on word change
            const timer = setTimeout(() => {
                word.playAudio()
                setIsButtonDisabled(false)

                setTypedWord("")
            }, 1000)

            return () => clearTimeout(timer) // Clear the timeout if the component unmounts or word changes
        }
    }, [gameStarted, word]) // Trigger on gameStarted or word change

    useEffect(() => {
        if (!gameStarted) return // Do nothing if the game hasn't started

        // Handle key down event for shift key to play audio
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Shift") {
                if (word && word.playAudio && gameType == "spelling") {
                    word.playAudio()
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [gameStarted, word]) // Trigger on gameStarted or word change

    const renderHearts = () => {
        const hearts = []
        for (let i = 0; i < lives; i++) {
            hearts.push(
                <img
                    key={`heart-${i}`}
                    className="heart"
                    src="/assets/images/icon/ic-heart.png"
                    alt="Heart"
                />
            )
        }
        for (let i = lives; i < 5; i++) {
            hearts.push(
                <img
                    key={`lose-${i}`}
                    className="heart"
                    src="/assets/images/icon/ic-lose.png"
                    alt="Lose"
                />
            )
        }
        return hearts
    }

    useEffect(() => {
        console.log("Range", rangeValue)
    })
    const [rangeValue, setRangeValue] = useState(0)
    useEffect(() => {
        if (gameType !== "syllable") {
            setRangeValue(0)
        } else {
            setRangeValue(1)
        }
    }, [gameType])

    const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRangeValue(Number(event.target.value))
    }

    const extractEnemyName = (imagePath: string) => {
        // Match the pattern of &attackType_name-a11-i12
        const match = imagePath.match(/&\w+_(\w+)-a\d+-i\d+/)
        return match ? match[1] : "unknown" // Return the name or 'unknown' if not found
    }

    const [showTutorial, setShowTutorial] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    const welcomeModalButtons = [
        <button
            key="start-game"
            onClick={() => {
                setShowWelcomeModal(false)
                setGameStarted(true)
                setShowTutorial(true)
            }}
        >
            Continue
        </button>,
    ]

    const steps = [
        "Welcome to the Playground! Let's walk through the basics.",
        "Step 1: An audio will prompt the of word to spell. You can repeat the audio by clicking the audio button.",
        "Step 2: Fill out your answer at the input box.",
        "Step 3: Check pronunciation and description guide for any additional hints.",
        "Step 4: Press 'Go' to attack the enemy.",
        "Be careful! If your spelling is incorrect, the enemy will attack you!",
        "Now you're ready! Press 'Start' to begin the game.",
    ]

    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            setShowTutorial(false)
        }
    }

    return (
        <main className="adventure-wrapper">
            <div className="game-exit">
                <FaSignOutAlt onClick={handleExitModal} />
            </div>
            {/* Welcome Modal */}
            <Modal
                className="welcome-modal"
                isOpen={showWelcomeModal}
                title="Welcome to Playground"
                details="Survive!"
                buttons={welcomeModalButtons}
            />

            <Modal
                className="welcome-modal"
                isOpen={showTutorial}
                title="Tutorial"
                details={steps[currentStep]}
                buttons={[
                    <button
                        key="start-game"
                        onClick={() => {
                            handleNextStep()
                        }}
                    >
                        {currentStep === steps.length - 1 ? "Start" : "Next"}
                    </button>,
                ]}
            />

            {/* Game Content */}
            {gameStarted && !loading && (
                <section className="adventure-platform">
                    <div className="platform-indicator">Playground</div>
                    <div className="lives-container">{renderHearts()}</div>

                    <section className="enemy-track">
                        {enemyData.map((enemy, enemyIndex) => {
                            const enemyName = extractEnemyName(enemy.imagePath)
                            return (
                                <div
                                    key={enemyIndex}
                                    className="enemy-track-list"
                                >
                                    {enemyIndex > 0 && (
                                        <div className="enemy-connector"></div>
                                    )}
                                    <div>
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
                            )
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
                                    width: "360px",
                                    height: "360px",
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
                                <style>{characterAnimation}</style>
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
                                    width: "360px",
                                    height: "360px",
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
                                <style>{enemyAnimation}</style>
                            </div>
                        </section>
                    </section>
                </section>
            )}

            {/* Confirmation Modal */}
            {gameStarted && (
                <section className="adventure-control">
                    <img src="/assets/images/background/bg-border_large.webp" />

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
                            {gameType === "syllable" ? (
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
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={word?.playAudio}
                                    >
                                        <FaVolumeUp />
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
                            )}
                        </form>
                    </section>

                    <section className="control-clue">
                        <h1>Word's Info</h1>

                        <section className="clue-container">
                            <span>Pronunciation</span>
                            <div className="clue-pronunciation ">
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

            {/* Game Over Modal */}
            <Modal
                className="gameover-modal"
                isOpen={showGameOverModal}
                title="Game Over"
                onClose={handleGameOverRestart}
                details="Unfortunately, you have run out of lives. Would you like to restart the game?"
                buttons={[
                    <button key="restart" onClick={handleGameOverRestart}>
                        Restart Game
                    </button>,
                    <button
                        key="exit"
                        onClick={() =>
                            (window.location.href = "/adventure-mode")
                        }
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
                    <button
                        key="exit"
                        onClick={() => (window.location.href = "/dashboard")}
                    >
                        Exit
                    </button>,
                    <button key="cancel" onClick={handleCancelExitModal}>
                        Cancel
                    </button>,
                ]}
            />

            <Modal
                className="conquer-floor-modal"
                isOpen={showConquerFloorModal}
                title="Floor Conquered!"
                details="Congratulations! You've conquered this floor.?"
                buttons={[
                    <button
                        key="menu"
                        onClick={() =>
                            (window.location.href = "/adventure-mode")
                        }
                    >
                        Return to Main Menu
                    </button>,
                ]}
            />
        </main>
    )
}

export default PlaygroundGameplay
