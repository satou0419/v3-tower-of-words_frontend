import { useState, useEffect, useCallback } from "react"

// Define the type for the word response
interface WordResponse {
    word: string
}

const useRandomWord = () => {
    const [words, setWords] = useState<string[]>([])
    const [randomWord, setCurrentWord] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    // Function to fetch a list of words with specified length and part of speech
    const fetchWords = async () => {
        setLoading(true)
        try {
            // Create queries for different lengths and parts of speech
            const lengths = [3, 4, 5, 6, 7]
            const pos = ["verb", "adj"]
            const wordPromises = lengths.flatMap((len) =>
                pos.map((partOfSpeech) =>
                    fetch(
                        `https://api.datamuse.com/words?sp=${"?".repeat(
                            len
                        )}&max=100&md=f&fq=${partOfSpeech}`
                    )
                )
            )

            // Fetch all word lists concurrently
            const responses = await Promise.all(wordPromises)

            const data = await Promise.all(
                responses.map((response) => response.json())
            )

            // Flatten and combine all words from different responses
            const allWords = data.flat().map((item: WordResponse) => item.word)
            setWords(allWords)

            // Optionally, pick an initial random word if needed
            selectRandomWord(allWords)
        } catch (error) {
            console.error("Error fetching words:", error)
        } finally {
            setLoading(false)
        }
    }

    // Function to select a random word from the list
    const selectRandomWord = (wordList: string[]) => {
        if (wordList.length > 0) {
            const randomIndex = Math.floor(Math.random() * wordList.length)
            setCurrentWord(wordList[randomIndex])
        } else {
            setCurrentWord("No words found")
        }
    }

    // Function to refresh the word list and select a new random word
    const refresh = useCallback(() => {
        selectRandomWord(words)
    }, [words])

    // Fetch words when the hook is first used
    useEffect(() => {
        fetchWords()
    }, [])

    return { randomWord, loading, refresh }
}

export default useRandomWord
