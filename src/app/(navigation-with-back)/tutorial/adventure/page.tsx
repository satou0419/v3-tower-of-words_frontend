"use client"

import { useState } from "react"
import "./adventure.scss"

// Sample data for tutorials
const tutorialData = [
    {
        imagePath: "path/to/image1.jpg",
        title: "First Tutorial",
        description: "This is the first tutorial description.",
    },
    {
        imagePath: "path/to/image2.jpg",
        title: "Second Tutorial",
        description: "This is the second tutorial description.",
    },
    {
        imagePath: "path/to/image3.jpg",
        title: "Third Tutorial",
        description: "This is the third tutorial description.",
    },
    {
        imagePath: "path/to/image4.jpg",
        title: "Fourth Tutorial",
        description: "This is the fourth tutorial description.",
    },
    {
        imagePath: "path/to/image5.jpg",
        title: "Fifth Tutorial",
        description: "This is the fifth tutorial description.",
    },
]

export default function AdventureSpelling() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex < tutorialData.length - 1 ? prevIndex + 1 : prevIndex
        )
    }

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex
        )
    }

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
                            ></div>
                        ))}
                    </section>

                    <button
                        onClick={handleNext}
                        disabled={currentIndex === tutorialData.length - 1}
                    >
                        Next
                    </button>
                </section>
            </section>
        </main>
    )
}
