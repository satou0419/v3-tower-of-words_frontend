"use client"
import useRandomWord from "@/hook/useRandomWord"
import useUserProgressStore from "@/store/userProgressStore"
import React from "react"

const WordDisplay: React.FC = () => {
    const silentFloorID = useUserProgressStore(
        (state) => state.userProgress.silentFloorID
    )

    return (
        <main>
            <h1>{silentFloorID}</h1>
        </main>
    )
}

export default WordDisplay
