"use client"
import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { InputBox } from "@/app/component/Input/Input"
import { useEnemyStore } from "@/store/enemyStore"
import Loading from "@/app/loading"
import useImageParse from "@/hook/useImageParse"
import "./adventure.scss"
import "./adventure_mobile.scss"

import "./animation.scss"
import Modal from "@/app/component/Modal/Modal"
import useAnimationKeyframes from "@/hook/useAnimationKeyframes"
import useMerriam from "@/hook/useMerriam"
import useAddWord from "@/hook/useAddWord"
import useProgressEquippedStore from "@/store/progressEquippedStore"
import getUserDetails from "@/lib/user-endpoint/getUserDetails"
import useUpdateProgress from "@/hook/useUpdateProgress"
import useRedeemReward from "@/hook/useRedeemReward"
import useFloorIncrement from "@/hook/useFloorIncrement"
import getUserItems from "@/lib/item-endpoint/getUserItem"
import useItem from "@/hook/useItem"
import { useGameplayStore } from "@/store/gameplayStore"
import ConfettiWrapper from "@/app/component/Confetti/Confetti"
import useIncrementFloor from "@/hook/useIncrementFloor"
import {
    FaEye,
    FaPencilAlt,
    FaSignOutAlt,
    FaVolumeUp,
    FaWater,
} from "react-icons/fa"
import useAchievementChecker from "@/hook/useAchievementChecker"
import AchievementToast from "@/app/component/AchievementToast/AchievementToast"
import useIncrementSyllableFloor from "@/hook/useIncrementSyllableFloor"
import useFloorSyllableIncrement from "@/hook/useIncrementSyllableFloor"
import useFloorSpellingIncrement from "@/hook/useFloorSpellingIncrement"
import useFloorSilentIncrement from "@/hook/useFloorSilentIncrement"

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

const AdventureGameplay = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true) // State for showing welcome modal
    const [gameStarted, setGameStarted] = useState<boolean>(false) // State for tracking game start
    const [isPronunciationLocked, setIsPronunciationLocked] = useState(true)
    const [isDefinitionLocked, setIsDefinitionLocked] = useState(false)
    const [isItemLocked] = useState(false)

    const lockedPronunciation = isPronunciationLocked ? "locked" : ""
    const lockedDefinition = isDefinitionLocked ? "locked" : ""

    const [showConquerFloorModal, setShowConquerFloorModal] = useState(false)

    //#endRegion

    //#region  Item Logic

    const [userItems, setUserItems] = useState<UserItem[]>([])
    const [showConfirmationModal, setShowConfirmationModal] =
        useState<boolean>(false)
    const [itemToUse, setItemToUse] = useState<{
        id: number
        name: string
    } | null>(null)

    useEffect(() => {
        const fetchUserItems = async () => {
            const items = await getUserItems()
            setUserItems(items)
        }

        fetchUserItems()
    }, [])
    const handleUnload = (event: BeforeUnloadEvent) => {
        const message =
            "Progress won't be saved. Are you sure you want to leave?"
        event.returnValue = message // Standard for most browsers
        return message // For some older browsers
    }

    // useEffect(() => {
    //     // Add event listener when the component mounts
    //     window.addEventListener("beforeunload", handleUnload)

    //     // Cleanup function to remove the event listener
    //     return () => {
    //         window.removeEventListener("beforeunload", handleUnload)
    //     }
    // }, []) // Empty dependency array ensures this effect runs once on mount

    const { useItemFunction } = useItem()

    const handleUseItem = (itemID: number, itemName: string) => {
        // Set the item to use and show the confirmation modal
        setItemToUse({ id: itemID, name: itemName })
        setShowConfirmationModal(true)
    }

    const confirmUseItem = async () => {
        if (itemToUse) {
            const { id, name } = itemToUse
            try {
                await useItemFunction(id)
                console.log(name)
                switch (name) {
                    case "Bandage":
                        addLives(1)
                        break
                    case "Medical Kit":
                        addLives(3)
                        break
                    case "Unusual Battery":
                        setIsPronunciationLocked(false)
                        break
                }
                // Fetch updated user items after successful use
                const updatedItems = await getUserItems()
                setUserItems(updatedItems)
            } catch (error) {
                console.error("Failed to use item:", error)
            } finally {
                // Close the confirmation modal after processing
                setShowConfirmationModal(false)
                setItemToUse(null)
            }
        }
    }

    const handleExitModal = () => {
        setShowExitModal(true)
    }

    const handleCancelExitModal = () => {
        setShowExitModal(false)
    }

    const cancelUseItem = () => {
        // Close the confirmation modal without using the item
        setShowConfirmationModal(false)
        setItemToUse(null)
    }
    //#endregion

    //#region Extracts data from URL
    const searchParams = useSearchParams()
    const floorIdParam = searchParams.get("floorId")
    const sectionParam = searchParams.get("section")
    const nextSectionParam = searchParams.get("nextSection")
    const nextFloorIdParam = searchParams.get("nextFloorId")
    const gameType = searchParams.get("gameType")

    const isClear = searchParams.get("clear")

    // Convert parameters to numbers with fallback to NaN if conversion fails
    const floorId = floorIdParam ? parseInt(floorIdParam, 10) : NaN
    const section = sectionParam ? parseInt(sectionParam, 10) : NaN
    const nextSection = nextSectionParam ? parseInt(nextSectionParam, 10) : NaN
    const nextFloorId = nextFloorIdParam ? parseInt(nextFloorIdParam, 10) : NaN

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

    const { enemies, fetchEnemies, fetchSilentEnemies, fetchSyllableEnemies } =
        useEnemyStore()
    const [enemyData, setEnemyData] = useState<any[]>([])
    const [currentEnemyIndex, setCurrentEnemyIndex] = useState<number>(0)
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0)
    const [typedWord, setTypedWord] = useState<string>("")

    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false)
    const [spelledWords, setSpelledWords] = useState<Record<number, boolean[]>>(
        {}
    )
    const [showConfetti, setShowConfetti] = useState<boolean>(false) // State for showing confetti
    const [defeatedEnemies, setDefeatedEnemies] = useState<number[]>([])

    const {
        addWord,
        isLoading: isAddingWord,
        error: addWordError,
    } = useAddWord()

    useEffect(() => {
        if (floorId) {
            if (gameType === "Spelling") fetchEnemies(Number(floorId))
            if (gameType === "Syllables") fetchSyllableEnemies(Number(floorId))
            if (gameType === "Silent") fetchSilentEnemies(Number(floorId))
        }
    }, [floorId, fetchEnemies])

    useEffect(() => {
        if (gameType === "Syllables" || gameType === "Spelling") {
            if (enemies.length > 0) {
                setEnemyData(enemies)
                setLoading(false)
                const initialSpelledWords: Record<number, boolean[]> = {}
                enemies.forEach((enemy, index) => {
                    initialSpelledWords[index] = new Array(
                        enemy.words.length
                    ).fill(false)
                })
                setSpelledWords(initialSpelledWords)
                console.log("Enemy Data", enemyData)
            }
        }
    }, [enemies])

    useEffect(() => {
        if (gameType === "Silent") {
            if (enemies.length > 0) {
                setEnemyData(enemies)
                setLoading(false)
                const initialSpelledWords: Record<number, boolean[]> = {}
                enemies.forEach((enemy, index) => {
                    initialSpelledWords[index] = new Array(
                        enemy.words.length
                    ).fill(false)
                })
                setSpelledWords(initialSpelledWords)
                console.log("Enemy Data", enemyData)
            }
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
    //const characterDetails = useImageParse("&melee_gloves-a24-i24")

    const enemyDetails = useImageParse(
        enemies[currentEnemyIndex]?.imagePath || ""
    )

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

    const { achievementChecker, achievementToast, closeToast } =
        useAchievementChecker()

    const currentEnemy = enemyData[currentEnemyIndex]

    let currentWord: string | undefined // Declare the variable outside

    if (gameType === "Silent") {
        currentWord = currentEnemy?.words[currentWordIndex].word // Assign in the if block
    } else {
        currentWord = currentEnemy?.words[currentWordIndex] // Assign in the else block
    }

    const word = useMerriam(currentWord)

    //#region Button state
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [selectedIndices, setSelectedIndices] = useState<number[]>([])
    const [selectedIndex, setSelectedIndex] = useState<string>("") // Start with empty string

    useEffect(() => {
        if (word?.word) {
            setSelectedIndex("0".repeat(word.word.length)) // Set to "00000" based on word length
        }
    }, [word]) // Runs when 'word' changes

    const handleClick = (index: number): void => {
        setSelectedIndices((prevSelectedIndices) => {
            const newSelection = prevSelectedIndices.includes(index)
                ? prevSelectedIndices.filter((i) => i !== index) // Unselect if already selected
                : [...prevSelectedIndices, index] // Select the letter

            const selectionString = word?.word
                ? word.word
                      .split("")
                      .map((_, i) => (newSelection.includes(i) ? "1" : "0"))
                      .join("")
                : "" // Fallback to empty string

            console.log("Selection string:", selectionString)
            setSelectedIndex(selectionString)

            return newSelection
        })
    }

    const clearSelections = (): void => {
        setSelectedIndices([])
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTypedWord(event.target.value)
    }

    const handleEnemyAttack = () => {
        setCharacterAttackType("")

        if (enemyDetails.attackType == "melee") {
            setEnemyAttackType("expand-width")

            setTimeout(() => {
                setIsEnemyAttacking(true)
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
                    setIsButtonDisabled(false)
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
                setIsButtonDisabled(false)

                setTimeout(() => {
                    if (gameType === "Syllables") {
                        setIsButtonDisabled(false)
                    }
                }, (characterDetails.attackFrame / 12) * 1200)
                setEnemyHit("hit")

                // Set character hit to "" after the hit duration
                setTimeout(() => {
                    setEnemyHit("")
                    // setIsButtonDisabled(false)
                }, 500) // 500ms is the duration of the hit
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
    const {
        updateSilentProgress,
        updateSpellingProgress,
        updateSyllableProgress,
        isLoading,
        error,
        data,
    } = useUpdateProgress()
    const { redeemReward } = useRedeemReward()
    const { incrementFloor } = useFloorIncrement()
    const { incrementSyllableFloor } = useFloorSyllableIncrement()
    const { incrementSpellingFloor } = useFloorSpellingIncrement()
    const { incrementSilentFloor } = useFloorSilentIncrement()

    const updateFloor = useIncrementFloor()

    const [hasStartAchievementCheck, setHasStartAchievementChecker] =
        useState(false)

    const { lives, subtractLives, addLives } = useGameplayStore()
    // Other state and hooks...

    const [silentIndex, setSilentIndex] = useState("")

    useEffect(() => {
        // console.log("Current Word", currentWord)
        // console.log("Current WordIndex", currentWordIndex)
        // console.log("Current Enemy", currentEnemy)
        // console.log("Current EnemyIndex", currentEnemyIndex)

        const data = currentEnemy?.words[currentWordIndex].silentIndex
        setSilentIndex(data)
    })

    //Logic in submitting the answer
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsButtonDisabled(true)
        const currentEnemy = enemyData[currentEnemyIndex]

        console.log("Silent Index", silentIndex)
        console.log("Selected Index", selectedIndex)
        //#region Assigning the value of currentWord base on gameplay
        if (gameType === "Silent") {
            const currentWord =
                currentEnemy.words[currentWordIndex].word.toLowerCase()
            setSilentIndex(currentEnemy.words[currentWordIndex].silentIndex)
        }

        if (gameType === "Spelling" || gameType === "Syllables") {
            const currentWord = currentEnemy?.words[currentWordIndex].word
        }

        //#endregion

        //#region Logic for correct answer
        if (
            (gameType === "Spelling" &&
                typedWord.toLowerCase() === currentWord) ||
            (gameType === "Syllables" && rangeValue === word?.syllable) ||
            (gameType === "Silent" && silentIndex === selectedIndex)
        ) {
            // Correct word spelling

            handleCharacterAttack()

            const updatedSpelledWords = { ...spelledWords }
            updatedSpelledWords[currentEnemyIndex][currentWordIndex] = true
            setSpelledWords(updatedSpelledWords)

            // Archive the correctly spelled word
            if (isClear === "false") {
                await addWord(currentWord || "")
                updateFloor
                achievementChecker("floors")
                if (gameType === "Syllables")
                    // achievementChecker("syllablefloors")

                    // achievementChecker("spellingfloors")

                    // achievementChecker("silentfloors")

                    setHasStartAchievementChecker(true)
            }

            setTimeout(() => {
                setIsCharacterAttacking(false)
                if (gameType === "Syllables") setRangeValue(1)
                if (gameType === "Silent") clearSelections()

                if (currentWordIndex === currentEnemy.words.length - 1) {
                    // Last word for this enemy defeated
                    setDefeatedEnemies((prevDefeatedEnemies) => [
                        ...prevDefeatedEnemies,
                        currentEnemyIndex,
                    ])

                    setTimeout(() => {
                        if (currentEnemyIndex === enemyData.length - 1) {
                            // All enemies defeated, show confetti
                            if (isClear === "false") {
                                console.log("Now it is clear")

                                if (gameType === "Syllables") {
                                    updateSyllableProgress(
                                        nextFloorId,
                                        nextSection
                                    )
                                    redeemReward(floorId)

                                    incrementSyllableFloor()
                                    achievementChecker("syllablefloors")
                                }

                                if (gameType === "Silent") {
                                    updateSilentProgress(
                                        nextFloorId,
                                        nextSection
                                    )
                                    redeemReward(floorId)
                                    incrementFloor()
                                    incrementSilentFloor()
                                }

                                if (gameType === "Spelling") {
                                    updateSpellingProgress(
                                        nextFloorId,
                                        nextSection
                                    )
                                    redeemReward(floorId)
                                    incrementFloor()
                                    incrementSpellingFloor()
                                    achievementChecker("spellingfloors")
                                }
                            } else {
                                console.log("It is cleared previously")
                            }
                            setShowConfetti(true)
                            setShowConquerFloorModal(true) // Show the conquering floor modal
                        } else {
                            setCurrentEnemyIndex(currentEnemyIndex + 1)
                            setCurrentWordIndex(0)
                            setIsPronunciationLocked(true)
                        }
                    }, 500) // Add delay before switching to next enemy (adjust as needed)
                } else {
                    setCurrentWordIndex(currentWordIndex + 1)
                    setIsPronunciationLocked(true)
                }
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

    const router = useRouter()
    const returnMenu = () => {
        console.log("Click menu")
        if (gameType === "Spelling") {
            router.push("/tower/spelling/?gameType=Spelling")
        }

        if (gameType === "Silent") {
            router.push("/tower/spelling/?gameType=Silent")
        }

        if (gameType === "Syllables") {
            router.push("/tower/spelling/?gameType=Syllables")
        }
    }

    //Play only the audio in gameType 1

    useEffect(() => {
        if (hasStartAchievementCheck === true) {
            console.log("Start Checking")
            achievementChecker("words")
            setHasStartAchievementChecker(false)
        }
    }, [hasStartAchievementCheck])

    useEffect(() => {
        if (
            (gameStarted &&
                word &&
                word.playAudio &&
                gameType === "Spelling") ||
            (gameStarted && word && word.playAudio && gameType === "Spelling")
        ) {
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
                if (word && word.playAudio && gameType == "Spelling") {
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

    const [rangeValue, setRangeValue] = useState(0)
    useEffect(() => {
        if (gameType !== "Syllables") {
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

    const welcomeModalButtons = [
        <button
            key="start-game"
            onClick={() => {
                setShowWelcomeModal(false)
                setGameStarted(true) // Start the game when the modal is closed
            }}
        >
            Start Game
        </button>,
    ]

    // State to track visibility of each section
    const [isItemVisible, setIsItemVisible] = useState(false)
    const [isInputVisible, setIsInputVisible] = useState(false)
    const [isClueVisible, setIsClueVisible] = useState(false)

    const [spriteWidth, setSpriteWidth] = useState("360")
    const [spriteHeight, setSpriteHeight] = useState("360")
    const [spriteSize, setSpriteSize] = useState("")

    // Detect screen size and update visibility when screen width is greater than 440px
    useEffect(() => {
        const updateVisibilityBasedOnScreenSize = () => {
            if (window.innerWidth > 768) {
                setIsItemVisible(true)
                setIsInputVisible(true)
                setIsClueVisible(true)

                setSpriteHeight("360")
                setSpriteWidth("360")
                setSpriteSize("")
            } else if (window.innerWidth > 600) {
                // Optionally reset or leave the values unchanged when below 440px
                setIsItemVisible(false)
                setIsInputVisible(true)
                setIsClueVisible(false)

                setSpriteHeight("260")
                setSpriteWidth("260")
                setSpriteSize("-260")
            } else {
                // Optionally reset or leave the values unchanged when below 440px
                setIsItemVisible(false)
                setIsInputVisible(true)
                setIsClueVisible(false)

                setSpriteHeight("180")
                setSpriteWidth("180")
                setSpriteSize("-180")
            }
        }

        // Run the function initially and on window resize
        updateVisibilityBasedOnScreenSize()
        window.addEventListener("resize", updateVisibilityBasedOnScreenSize)

        // Cleanup the event listener on unmount
        return () =>
            window.removeEventListener(
                "resize",
                updateVisibilityBasedOnScreenSize
            )
    }, [])

    // Function to toggle visibility of sections
    const handleButtonItem = () => {
        setIsItemVisible(true)
        setIsInputVisible(false)
        setIsClueVisible(false)
        console.log("Item CLick")
    }

    const handleButtonInput = () => {
        setIsItemVisible(false)
        setIsInputVisible(true)
        setIsClueVisible(false)
        console.log("Item CLick")
    }

    const handleButtonClue = () => {
        setIsItemVisible(false)
        setIsInputVisible(false)
        setIsClueVisible(true)
        console.log("Item CLick")
    }

    if (!floorId || loading || !imagesLoaded) {
        return <Loading />
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
                title="Welcome to Adventure Game"
                details="Defeat all the enemies to win!"
                buttons={welcomeModalButtons}
            />

            {/* Game Content */}
            {gameStarted && (
                <section className="adventure-platform">
                    <section className="control-buttons">
                        <button
                            className="button-item"
                            onClick={handleButtonItem}
                        >
                            <FaWater />
                        </button>
                        <button
                            className="button-input"
                            onClick={handleButtonInput}
                        >
                            <FaPencilAlt />
                        </button>
                        <button
                            className="button-clue"
                            onClick={handleButtonClue}
                        >
                            <FaEye />
                        </button>
                    </section>

                    <div className="platform-indicator">Floor {floorId}</div>
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
                            )
                        })}
                    </section>
                    <section
                        className="sprite-holder"
                        style={
                            {
                                // width: `100%`,
                            }
                        }
                    >
                        {/* Character Sprite */}
                        <section
                            className={`character-container ${characterAttackType} ${characterHit}`}
                            style={{
                                width: `${spriteWidth}px`,
                                height: `${spriteHeight}px`,
                            }}
                        >
                            <div
                                className={`character-sprite ${
                                    isCharacterAttacking
                                        ? `attack-${characterDetails.name}`
                                        : `idle-${characterDetails.name}`
                                }`}
                                style={{
                                    position: "absolute",
                                    // backgroundColor: "red",
                                    bottom: 0,
                                    right: 0,
                                    backgroundImage: `url("/assets/images/sprite/${characterDetails.name}${spriteSize}.png")`,
                                    width: `${spriteWidth}px`,
                                    height: `${spriteHeight}px`,
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
                            style={{
                                width: `${spriteWidth}px`,
                                height: `${spriteHeight}px`,
                            }}
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
                                    // backgroundColor: "blue",
                                    backgroundImage: `url("/assets/images/sprite/${enemyDetails.name}${spriteSize}.png")`,
                                    width: `${spriteWidth}px`,
                                    height: `${spriteHeight}px`,
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
                        style={{ display: isItemVisible ? "" : "none" }}
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

                    <section
                        className="control-input"
                        style={{ display: isInputVisible ? "" : "none" }}
                    >
                        <form onSubmit={handleSubmit}>
                            {achievementToast && (
                                <AchievementToast
                                    message={achievementToast.message}
                                    imageUrl={achievementToast.imageUrl}
                                    onClose={closeToast}
                                />
                            )}
                            {gameType === "Syllables" ? (
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
                            ) : gameType === "Spelling" ? (
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

                    <section
                        className="control-clue"
                        style={{ display: isClueVisible ? "" : "none" }}
                    >
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
                            (window.location.href = "/tower/spelling")
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
                        onClick={() => (window.location.href = "/select-tower")}
                    >
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
                title="Floor Conquered!"
                details="Congratulations! You've conquered this floor.?"
                buttons={[
                    <button key="menu" onClick={returnMenu}>
                        Return to Main Menu
                    </button>,
                ]}
            />
        </main>
    )
}

export default AdventureGameplay
