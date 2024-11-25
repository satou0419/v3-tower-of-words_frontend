"use client"
import { useEffect, useState, useRef } from "react"
import "../game-tutorial.scss"
import { useTutorialStore } from "@/store/useTutorialStore"
import useUpdateTutorialStatus from "@/hook/useUpdateTutorialStatus "

interface TutorialData {
    imagePath: string
    description: string
}

const tutorialData: TutorialData[] = [
    {
        imagePath: "assets/images/tutorial/playground/playground_1.png",
        description:
            "Playground is Tower of Word’s endless mode. You will encounter enemies that hold random words. The difficulty of words is undetermined.",
    },
    {
        imagePath: "assets/images/tutorial/playground/playground_2.png",
        description: "Correctly spelling the words gives you credit.",
    },
    {
        imagePath: "assets/images/tutorial/playground/playground_3.png",
        description: "Items are locked, so you can’t use healing items.",
    },
]

export default function Playground() {
    const { onFinish, setOnFinish } = useTutorialStore() // Access Zustand store
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const {
        updateTutorialStatus,
        loading: isUpdating,
        error: isError,
    } = useUpdateTutorialStatus()

    const callbackRef = useRef(() => {
        updateTutorialStatus("playground")
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
