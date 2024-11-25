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
        imagePath: "assets/images/tutorial/simulation_all/simulation_all_1.png",
        title: "First Tutorial",
        description:
            "In simulation, you have ‘Chances’ instead of ‘HP’. Each word you encounter (not enemies) has chances. ",
    },
    {
        imagePath: "assets/images/tutorial/simulation_all/simulation_all_2.png",
        title: "Second Tutorial",
        description:
            "If you incorrectly given an answer, the enemy will attack you and you will lose 1 ‘chance’. ",
    },
    {
        imagePath: "assets/images/tutorial/simulation_all/simulation_all_3.png",
        title: "Third Tutorial",
        description:
            "If all chances are gone, it means you failed to give a correct answer for that word and you will proceed to the next word. ",
    },
    {
        imagePath: "assets/images/tutorial/simulation_all/simulation_all_4.png",
        title: "Fourth Tutorial",
        description:
            "‘Attack intervals’ are the amount of time you are given to give an answer, if the time runs out the enemy will attack you and you will lose 1 chance. ",
    },
    {
        imagePath:
            "assets/images/tutorial/simulation_silent/simulation_silent_5.png",
        title: "Fifth Tutorial",
        description: "Click the audio button to hear the word.",
    },
    {
        imagePath:
            "assets/images/tutorial/simulation_silent/simulation_silent_6.png",
        title: "Sixth Tutorial",
        description: "Then select which letter/s is silent in the word spoken.",
    },
    {
        imagePath:
            "assets/images/tutorial/simulation_silent/simulation_silent_7.png",
        title: "Seventh Tutorial",
        description: "Press the ‘Go!’ to submit the answer. ",
    },
]

export default function SimulationSilent() {
    const { onFinish, setOnFinish } = useTutorialStore() // Access Zustand store
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const {
        updateTutorialStatus,
        loading: isUpdating,
        error: isError,
    } = useUpdateTutorialStatus()

    const callbackRef = useRef(() => {
        updateTutorialStatus("silentsimu")
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
