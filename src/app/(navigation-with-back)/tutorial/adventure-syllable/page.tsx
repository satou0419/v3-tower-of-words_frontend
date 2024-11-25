"use client"
import { useEffect, useState, useRef } from "react"
import { useTutorialStore } from "@/store/useTutorialStore"
import useUpdateTutorialStatus from "@/hook/useUpdateTutorialStatus "
import "../game-tutorial.scss"

interface TutorialData {
    imagePath: string
    title: string
    description: string
}

const tutorialData: TutorialData[] = [
    {
        imagePath:
            "assets/images/tutorial/adventure_syllable/adventure_syllable_1.png",
        title: "First Tutorial",
        description:
            "Read the word given and identify how many syllables it has.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_syllable/adventure_syllable_2.png",
        title: "Second Tutorial",
        description:
            "Scroll the slider to the number of the syllables of the word.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_syllable/adventure_syllable_3.png",
        title: "Third Tutorial",
        description: "Press the ‘Go!’ to submit the answer.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_syllable/adventure_syllable_4.png",
        title: "Fourth Tutorial",
        description:
            "If the number of syllables is correct, you attack and damage the enemy. Otherwise, if your number of syllables is incorrect, the enemy will attack you.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_syllable/adventure_syllable_5.png",
        title: "Fifth Tutorial",
        description:
            "If the enemy attacks you, you lose 1 HP. If you lose all your HP, it's game over.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_syllable/adventure_syllable_6.png",
        title: "Sixth Tutorial",
        description:
            "Each enemy can hold multiple words. Defeat the enemy by correctly identifying the number of syllables of the words.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_syllable/adventure_syllable_7.png",
        title: "Seventh Tutorial",
        description:
            "Defeat all enemies on the floor to proceed to the next floor.",
    },
]

export default function AdventureSyllable() {
    const { onFinish, setOnFinish } = useTutorialStore() // Access Zustand store
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const {
        updateTutorialStatus,
        loading: isUpdating,
        error: isError,
    } = useUpdateTutorialStatus()

    const callbackRef = useRef(() => {
        updateTutorialStatus("syllableadventure")
    })

    useEffect(() => {
        // Set the onFinish callback only once on mount
        setOnFinish(callbackRef.current)
    }, [setOnFinish]) // Run only once on mount

    const handleNext = () => {
        if (currentIndex < tutorialData.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1)
        } else {
            // Trigger onFinish when tutorial is complete
            if (onFinish) {
                onFinish() // This will update tutorial status and can navigate or perform other actions
            }
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1)
        }
    }

    const isLastSlide = currentIndex === tutorialData.length - 1

    return (
        <main id="tutorial-wrapper">
            <section id="tutorial-container">
                <section id="tutorial-img">
                    <img
                        src={tutorialData[currentIndex].imagePath}
                        alt="tutorial"
                    />
                </section>

                <section id="tutorial-description">
                    <h1>{tutorialData[currentIndex].title}</h1>
                    <p>{tutorialData[currentIndex].description}</p>
                </section>

                <section id="tutorial-controls">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        Previous
                    </button>

                    <section id="indicator">
                        {tutorialData.map((_, index) => (
                            <div
                                key={index}
                                className={`icons ${
                                    index === currentIndex
                                        ? "active"
                                        : "inactive"
                                }`}
                            />
                        ))}
                    </section>

                    <button onClick={handleNext}>
                        {isLastSlide ? "Finish" : "Next"}
                    </button>
                </section>
            </section>
        </main>
    )
}
