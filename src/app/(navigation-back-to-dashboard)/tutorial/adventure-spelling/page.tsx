"use client"

import { useState, useEffect, useRef } from "react"
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
            "assets/images/tutorial/adventure_spelling/adventure_spelling_1.png",
        title: "First Tutorial",
        description: "Click the audio button to hear the word.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_spelling/adventure_spelling_2.png",
        title: "Second Tutorial",
        description:
            "Type the spelling of the word that you heard in the input box.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_spelling/adventure_spelling_3.png",
        title: "Third Tutorial",
        description: "Click the ‘Go!’ button after spelling the word.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_spelling/adventure_spelling_4.png",
        title: "Fourth Tutorial",
        description:
            "If the spelling is correct, you attack and damage the enemy. If it's incorrect, the enemy will attack you.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_spelling/adventure_spelling_5.png",
        title: "Fifth Tutorial",
        description:
            "If the enemy attacks you, you lose 1 HP. If you lose all your HP, it's game over.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_spelling/adventure_spelling_6.png",
        title: "Sixth Tutorial",
        description:
            "Each enemy can hold multiple words. Defeat the enemy by correctly spelling the words of the enemy.",
    },
    {
        imagePath:
            "assets/images/tutorial/adventure_spelling/adventure_spelling_7.png",
        title: "Seventh Tutorial",
        description:
            "Defeat all enemies on the floor to proceed to the next floor.",
    },
]

export default function AdventureSpelling() {
    const { onFinish, setOnFinish } = useTutorialStore() // Access Zustand store
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const {
        updateTutorialStatus,
        loading: isUpdating,
        error: isError,
    } = useUpdateTutorialStatus()

    const callbackRef = useRef(() => {
        updateTutorialStatus("spellingadventure")
    })

    useEffect(() => {
        setOnFinish(callbackRef.current)
    }, [setOnFinish]) // Run only once on mount

    const handleNext = () => {
        if (currentIndex < tutorialData.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1)
        } else {
            if (onFinish) {
                onFinish() // Trigger the onFinish callback when the last step is reached
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
