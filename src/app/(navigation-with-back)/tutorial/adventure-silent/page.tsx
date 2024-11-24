"use client"
import { useEffect, useState, useRef } from "react"
import "./adventure.scss"
import { useTutorialStore } from "@/store/useTutorialStore"
import useUpdateTutorialStatus from "@/hook/useUpdateTutorialStatus "

interface TutorialData {
    imagePath: string
    title: string
    description: string
}

const tutorialData: TutorialData[] = [
    {
        imagePath:
            "assets/images/tutorial/adventure_silent/adventure_silent_1.png",
        title: "First Tutorial",
        description: "Click the audio button to hear the word.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_silent/adventure_silent_2.png",
        title: "Second Tutorial",
        description: "Then select which letter/s is silent in the word spoken.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_silent/adventure_silent_3.png",
        title: "Third Tutorial",
        description: "Press the ‘Go!’ to submit the answer.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_silent/adventure_silent_4.png",
        title: "Fourth Tutorial",
        description:
            "If the chosen letter is correct, you attack and damage the enemy. Otherwise, if your chosen letter is incorrect, the enemy will attack you.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_silent/adventure_silent_5.png",
        title: "Fifth Tutorial",
        description:
            "If the enemy attacks you, you lose 1 HP. If you lose all your HP, it's game over.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_silent/adventure_silent_6.png",
        title: "Sixth Tutorial",
        description:
            "Each enemy can hold multiple words. Defeat the enemy by correctly identifying the silent letters of the enemy's words.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_silent/adventure_silent_7.png",
        title: "Seventh Tutorial",
        description:
            "Defeat all enemies on the floor to proceed to the next floor.",
    },
]

export default function AdventureSilent() {
    const { onFinish, setOnFinish } = useTutorialStore() // Access Zustand store
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const {
        updateTutorialStatus,
        loading: isUpdating,
        error: isError,
    } = useUpdateTutorialStatus()

    const callbackRef = useRef(() => {
        updateTutorialStatus("silentadventure")
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
