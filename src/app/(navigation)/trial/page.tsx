"use client"
import useAchievementChecker from "@/hook/useAchievementChecker"
import { useState, useEffect } from "react"

const AudioToText = () => {
    const [transcript, setTranscript] = useState<string>("")
    const [recognition, setRecognition] = useState<any>(null)
    const [isListening, setIsListening] = useState<boolean>(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [audioFile, setAudioFile] = useState<File | null>(null)

    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition
        if (SpeechRecognition) {
            const recog = new SpeechRecognition()
            recog.lang = "en-GB"
            recog.continuous = true

            recog.onresult = (event: any) => {
                let interimTranscript = ""
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    interimTranscript += event.results[i][0].transcript
                }
                setTranscript(interimTranscript)
            }

            recog.onerror = (event: any) => {
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

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setAudioFile(file)
            const fileUrl = URL.createObjectURL(file)
            setAudioUrl(fileUrl)
        }
    }

    const playAndTranscribeAudio = () => {
        if (audioUrl && audioFile) {
            const audio = new Audio(audioUrl)
            audio.play()
            startListening()

            audio.onended = () => {
                stopListening()
            }
        }
    }

    return (
        <div>
            <h1>Upload Audio File and Convert to Text</h1>
            <input type="file" accept="audio/*" onChange={handleFileUpload} />
            {audioUrl && (
                <button onClick={playAndTranscribeAudio}>
                    Play and Transcribe
                </button>
            )}
            <div>
                <h2>Transcript:</h2>
                <p>{transcript}</p>
            </div>
        </div>
    )
}

export default AudioToText
