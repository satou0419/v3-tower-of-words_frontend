"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import { InputBox, InputLine } from "@/app/component/Input/Input";
import "./teacherword.scss";
import viewSimulationWords from "@/lib/simulation-endpoint/viewSimulationWords";
import useMerriam from "@/hook/useMerriam";
import useAddWordBank from "@/hook/useAddWordBank";
import Toast from "@/app/component/Toast/Toast";
import useRemoveWordBank from "@/hook/useRemoveWordBank";

const TeacherWord = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [word, setWord] = useState<string>("");
    const [selectedWord, setSelectedWord] = useState<string>("");
    const [simulationWords, setSimulationWords] = useState<any[]>([]);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "warning">(
        "success"
    );
    const [silentLetters, setSilentLetters] = useState<string>("");
    const merriamData = useMerriam(word);
    const { addWordBank } = useAddWordBank();
    const { removeWordBank } = useRemoveWordBank();

    // Function to fetch simulation words
    const fetchSimulationWords = async () => {
        try {
            const data = await viewSimulationWords();
            setSimulationWords(data || []);
        } catch (error) {
            console.error("Error fetching simulation words:", error);
            setSimulationWords([]);
        }
    };

    // Fetch words on component mount
    useEffect(() => {
        fetchSimulationWords();
    }, []);

    useEffect(() => {
        setSelectedWord(word);
        setSilentLetters(word ? "0".repeat(word.length) : ""); // Initialize silentLetters with 0s
    }, [word]);

    const handleWordClick = (selectedWord: string) => {
        setWord(selectedWord);
        const selectedWordData = simulationWords.find(
            (wordItem) => wordItem.word === selectedWord
        );
        if (selectedWordData) {
            console.log(
                "Selected Word ID:",
                selectedWordData.simulationWordsID
            );
        }
    };

    const handleRemoveWordBank = async () => {
        const selectedWordData = simulationWords.find(
            (wordItem) => wordItem.word === selectedWord
        );
        if (selectedWordData) {
            console.log(
                "Selected Word ID:",
                selectedWordData.simulationWordsID
            );
            try {
                await removeWordBank(selectedWordData.simulationWordsID);
                setToastMessage("Word removed successfully!");
                setToastType("success");
                await fetchSimulationWords();
            } catch (error) {
                setToastMessage("Failed to remove word from word bank");
                setToastType("error");
            }
        }
    };

    const handleAddWord = async () => {
        if (simulationWords.some((wordItem) => wordItem.word === word)) {
            setToastMessage("Word already exists in the word bank");
            setToastType("warning");
            return;
        }

        try {
            await addWordBank(word, silentLetters);
            setToastMessage("Word added successfully!");
            setToastType("success");
            await fetchSimulationWords();
        } catch (error) {
            setToastMessage("Failed to add word to word bank");
            setToastType("error");
        }
    };

    const handleLetterClick = (index: number) => {
        const newSilentLetters = silentLetters.split("");
        newSilentLetters[index] = newSilentLetters[index] === "0" ? "1" : "0";
        const updatedSilentLetters = newSilentLetters.join("");
        setSilentLetters(updatedSilentLetters);

        console.log("Updated Silent Letters:", updatedSilentLetters);
    };

    const formatWord = (word: string) => {
        return word.toUpperCase().split("").join(" ");
    };

    const isWordSelected = word || selectedWord;
    const hasMerriamData =
        merriamData && merriamData.word && merriamData.definition;

    return (
        <main className="main-wrapper">
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}
            <button onClick={() => router.back()}>Back</button>
            <section className="wordarchive-container">
                <section className="left-section">
                    <section className="search-card">
                        <h1>Search words in Merriam</h1>
                        <InputBox
                            placeholder="Search word..."
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                        />
                    </section>
                    <CardWord className="wordarchive-left">
                        <div className="left-container">
                            <InputLine placeholder="Search..." />
                            <div className="word-list">
                                {simulationWords.length > 0 ? (
                                    simulationWords.map((wordItem) => (
                                        <span
                                            key={wordItem.id || wordItem.word}
                                            onClick={() =>
                                                handleWordClick(wordItem.word)
                                            }
                                            className={`word-item ${
                                                wordItem.word === word
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            {wordItem.word}
                                        </span>
                                    ))
                                ) : (
                                    <h1>No words available</h1>
                                )}
                            </div>
                        </div>
                    </CardWord>
                </section>
                <CardWord className="wordarchive-right">
                    <section className="right-container">
                        {isWordSelected ? (
                            <>
                                {hasMerriamData ? (
                                    <>
                                        <div className="word-control">
                                            <button
                                                onClick={handleRemoveWordBank}
                                            >
                                                Remove
                                            </button>
                                            <h1>{merriamData.word}</h1>
                                            <span className="pronunciation">
                                                {merriamData.pronunciation}
                                            </span>
                                            <span
                                                onClick={merriamData.playAudio}
                                            >
                                                Play
                                            </span>
                                        </div>
                                        <div className="word-define">
                                            <span className="part-of-speech">
                                                {merriamData.partOfSpeech}
                                            </span>
                                            <span className="definition">
                                                {merriamData.definition}
                                            </span>
                                        </div>
                                        <section className="silent-word">
                                            <h1>Set Silent Letters</h1>
                                            <section className="letter-list">
                                                {selectedWord
                                                    .toUpperCase()
                                                    .split("")
                                                    .map((letter, index) => (
                                                        <span
                                                            key={index}
                                                            onClick={() =>
                                                                handleLetterClick(
                                                                    index
                                                                )
                                                            }
                                                            className={`letter-item ${
                                                                silentLetters[
                                                                    index
                                                                ] === "1"
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {letter}
                                                        </span>
                                                    ))}
                                            </section>
                                        </section>
                                        <button onClick={handleAddWord}>
                                            Add to Word Bank
                                        </button>
                                    </>
                                ) : (
                                    <h1>No data available for this word</h1>
                                )}
                            </>
                        ) : (
                            <h1>No word selected</h1>
                        )}
                    </section>
                </CardWord>
            </section>
        </main>
    );
};

export default TeacherWord;
