"use client"
import React, { useEffect, useState } from "react"
import useUserGameTutorialStatusStore from "@/store/userGameTutorialStatusStore"
import useTutorialStatus from "@/hook/useTutorialStatus"

const TutorialStatusComponent = () => {
    const { error, loading } = useTutorialStatus() // Using the custom hook
    const tutorialStatus = useUserGameTutorialStatusStore(
        (state) => state.tutorialStatus
    ) // Accessing Zustand store
    const [tutorialMessage, setTutorialMessage] = useState("")

    useEffect(() => {
        if (tutorialStatus.firstGamePlayground) {
            setTutorialMessage("You've completed the Playground tutorial!")
        } else if (tutorialStatus.firstGameSilentSimu) {
            setTutorialMessage(
                "You've completed the Silent Simulation tutorial!"
            )
        } else if (tutorialStatus.firstGameSpellingSimu) {
            setTutorialMessage(
                "You've completed the Spelling Simulation tutorial!"
            )
        } else if (tutorialStatus.firstGameSyllableSimu) {
            setTutorialMessage(
                "You've completed the Syllable Simulation tutorial!"
            )
        } else {
            setTutorialMessage("You haven't completed any tutorial yet.")
        }
    }, [tutorialStatus]) // When tutorialStatus changes, update the message

    if (loading) {
        return <div>Loading tutorial status...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <h2>Welcome to the Tutorial Status Page!</h2>
            <p>{tutorialMessage}</p>
            {/* Display details from Zustand store */}
            <div>
                <h3>Your Tutorial Progress:</h3>
                <ul>
                    <li>
                        Playground Tutorial:{" "}
                        {tutorialStatus.firstGamePlayground
                            ? "Completed"
                            : "Not Completed"}
                    </li>
                    <li>
                        Silent Simulation Tutorial:{" "}
                        {tutorialStatus.firstGameSilentSimu
                            ? "Completed"
                            : "Not Completed"}
                    </li>
                    <li>
                        Spelling Simulation Tutorial:{" "}
                        {tutorialStatus.firstGameSpellingSimu
                            ? "Completed"
                            : "Not Completed"}
                    </li>
                    <li>
                        Syllable Simulation Tutorial:{" "}
                        {tutorialStatus.firstGameSyllableSimu
                            ? "Completed"
                            : "Not Completed"}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default TutorialStatusComponent
