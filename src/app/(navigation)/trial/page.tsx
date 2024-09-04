"use client"
import useRandomWord from "@/hook/useRandomWord"
import React from "react"

const WordDisplay: React.FC = () => {
    const { randomWord, loading, refresh } = useRandomWord()

    return (
        <div>
            <h1>Random Word:</h1>
            <p>{loading ? "Loading..." : randomWord}</p>
            <button onClick={refresh}>Get New Random Word</button>
        </div>
    )
}

export default WordDisplay
