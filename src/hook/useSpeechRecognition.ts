import { useState, useEffect } from "react"

// Custom type declarations
interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult> {}

interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionError extends Error {
    readonly error: string
}

interface SpeechRecognition extends EventTarget {
    lang: string
    continuous: boolean
    start(): void
    stop(): void
    onresult: (event: SpeechRecognitionEvent) => void
    onerror: (event: SpeechRecognitionError) => void
}

// Use `any` for the SpeechRecognition constructor to avoid TypeScript errors
export const useSpeechRecognition = () => {
    const [transcript, setTranscript] = useState<string>("")
    const [recognition, setRecognition] = useState<any>(null) // Use `any` here
    const [isListening, setIsListening] = useState<boolean>(false) // Track listening state

    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition
        if (SpeechRecognition) {
            const recog = new SpeechRecognition()
            recog.lang = "en-GB"
            recog.continuous = true

            recog.onresult = (event: SpeechRecognitionEvent) => {
                let transcript = ""
                for (const result of event.results) {
                    transcript += result[0].transcript
                }
                // Remove punctuation from the transcript
                const cleanedTranscript = transcript.replace(/[.,!?;:]/g, "")
                setTranscript(cleanedTranscript)
            }

            recog.onerror = (event: SpeechRecognitionError) => {
                console.error("Speech recognition error:", event.error)
            }

            setRecognition(recog)
        } else {
            console.error(
                "Speech Recognition is not supported in this browser."
            )
        }
    }, [])

    const startListening = () => {
        if (recognition && !isListening) {
            recognition.start()
            setIsListening(true)
        }
    }

    const stopListening = () => {
        if (recognition && isListening) {
            recognition.stop()
            setIsListening(false)
        }
    }

    return { transcript, startListening, stopListening, isListening }
}
