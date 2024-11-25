"use client"
import { useState, useEffect } from "react"
import AdventureSpelling from "./adventure-spelling/page"
import AdventureSyllable from "./adventure-syllable/page"
import AdventureSilent from "./adventure-silent/page"
import "./tutorial.scss"
import SimulationSpelling from "./simulation-spelling/page"
import SimulationSyllable from "./simulation-syllable/page"
import SimulationSilent from "./simulation-silent/page"
import Playground from "./playground/page"
import useUserGameTutorialStatusStore from "@/store/userGameTutorialStatusStore"
import Loading from "@/app/loading"

type TutorialComponent =
    | "adventure-spelling"
    | "adventure-syllable"
    | "adventure-silent"
    | "simulation-spelling"
    | "simulation-syllable"
    | "simulation-silent"
    | "playground"
    | null

export default function Tutorial() {
    const [currentComponent, setCurrentComponent] =
        useState<TutorialComponent>(null)

    const [isLoading, setIsLoading] = useState(true)

    // Track the currently selected tutorial for styling
    const [selectedTutorial, setSelectedTutorial] =
        useState<TutorialComponent>(null)

    // Fetching tutorial status from Zustand store
    const tutorialStatus = useUserGameTutorialStatusStore(
        (state) => state.tutorialStatus
    )

    // Safe access of tutorialStatus to avoid errors
    const isTutorialCompleted = tutorialStatus
        ? {
              playground: tutorialStatus.firstGamePlayground,
              silentSimu: tutorialStatus.firstGameSilentSimu,
              silentAdventure: tutorialStatus.firstGameSilentAdventure,
              spellingAdventure: tutorialStatus.firstGameSpellingAdventure,
              syllableSimu: tutorialStatus.firstGameSyllableSimu,
              syllableAdventure: tutorialStatus.firstGameSyllableAdventure,
              spellingSimu: tutorialStatus.firstGameSpellingSimu,
          }
        : {
              playground: false,
              silentSimu: false,
              silentAdventure: false,
              spellingAdventure: false,
              syllableSimu: false,
              syllableAdventure: false,
              spellingSimu: false,
          }

    // Function to find the first unlocked tutorial
    const getFirstUnlockedTutorial = () => {
        if (isTutorialCompleted.spellingAdventure) return "adventure-spelling"
        if (isTutorialCompleted.syllableAdventure) return "adventure-syllable"
        if (isTutorialCompleted.silentAdventure) return "adventure-silent"
        if (isTutorialCompleted.spellingSimu) return "simulation-spelling"
        if (isTutorialCompleted.syllableSimu) return "simulation-syllable"
        if (isTutorialCompleted.silentSimu) return "simulation-silent"
        if (isTutorialCompleted.playground) return "playground"
        return null // No tutorial is unlocked yet
    }

    useEffect(() => {
        if (tutorialStatus) {
            const firstUnlocked = getFirstUnlockedTutorial()
            if (firstUnlocked !== null) {
                setCurrentComponent(firstUnlocked) // Set the first unlocked tutorial
                setSelectedTutorial(firstUnlocked) // Set the initial selected tutorial
                setIsLoading(false) // Set loading to false after determining the tutorial
            }
        }
    }, [tutorialStatus]) // Effect runs when tutorialStatus changes

    // Function to render the appropriate component based on the state
    const renderComponent = () => {
        switch (currentComponent) {
            case "adventure-spelling":
                return <AdventureSpelling />
            case "adventure-syllable":
                return <AdventureSyllable />
            case "adventure-silent":
                return <AdventureSilent />
            case "simulation-spelling":
                return <SimulationSpelling />
            case "simulation-syllable":
                return <SimulationSyllable />
            case "simulation-silent":
                return <SimulationSilent />
            case "playground":
                return <Playground />
            default:
                return null // No tutorial available
        }
    }

    const handleTutorialClick = (tutorial: TutorialComponent) => {
        setCurrentComponent(tutorial)
        setSelectedTutorial(tutorial)
    }

    if (isLoading) {
        // Show the Loading component while fetching the tutorial status
        return <Loading />
    }

    return (
        <main id="tutorial-wrapper">
            <section id="tutorial-section">
                <section id="tutorial-side">
                    <div id="side-content">
                        {/* Render the tutorial options only if the status is true */}
                        {isTutorialCompleted.spellingAdventure && (
                            <span
                                className={
                                    selectedTutorial === "adventure-spelling"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleTutorialClick("adventure-spelling")
                                }
                            >
                                Adventure Spelling
                            </span>
                        )}
                        {isTutorialCompleted.syllableAdventure && (
                            <span
                                className={
                                    selectedTutorial === "adventure-syllable"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleTutorialClick("adventure-syllable")
                                }
                            >
                                Adventure Syllable
                            </span>
                        )}
                        {isTutorialCompleted.silentAdventure && (
                            <span
                                className={
                                    selectedTutorial === "adventure-silent"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleTutorialClick("adventure-silent")
                                }
                            >
                                Adventure Silent
                            </span>
                        )}

                        {isTutorialCompleted.spellingSimu && (
                            <span
                                className={
                                    selectedTutorial === "simulation-spelling"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleTutorialClick("simulation-spelling")
                                }
                            >
                                Simulation Spelling
                            </span>
                        )}
                        {isTutorialCompleted.syllableSimu && (
                            <span
                                className={
                                    selectedTutorial === "simulation-syllable"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleTutorialClick("simulation-syllable")
                                }
                            >
                                Simulation Syllable
                            </span>
                        )}
                        {isTutorialCompleted.silentSimu && (
                            <span
                                className={
                                    selectedTutorial === "simulation-silent"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleTutorialClick("simulation-silent")
                                }
                            >
                                Simulation Silent
                            </span>
                        )}

                        {isTutorialCompleted.playground && (
                            <span
                                className={
                                    selectedTutorial === "playground"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleTutorialClick("playground")
                                }
                            >
                                Playground
                            </span>
                        )}
                    </div>
                </section>

                <section id="tutorial-main">
                    <div id="main-content">{renderComponent()}</div>
                </section>
            </section>
        </main>
    )
}
