"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import { InputBox, InputLine } from "@/app/component/Input/Input";
import "./teacherword.scss";
import viewSimulationWords from "@/lib/simulation-endpoint/viewSimulationWords";
import useMerriam from "@/hook/useMerriam";

const TeacherWord = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [word, setWord] = useState<string>("");
    const [selectedWord, setSelectedWord] = useState<string>("");
    const [simulationWords, setSimulationWords] = useState<any[]>([]);
    const merriamData = useMerriam(word);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await viewSimulationWords();
                setSimulationWords(data || []); // Ensure that data is an array
            } catch (error) {
                console.error("Error fetching simulation words:", error);
                setSimulationWords([]);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setSelectedWord(word);
    }, [word]);

    const handleWordClick = (selectedWord: string) => {
        setWord(selectedWord);
    };

    const formatWord = (word: string) => {
        return word.toUpperCase().split("").join(" ");
    };

    const isWordSelected = word || selectedWord;
    const hasMerriamData =
        merriamData && merriamData.word && merriamData.definition;

    return (
        <main className="main-wrapper">
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
                                            <button>Remove</button>
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
                                    </>
                                ) : (
                                    <h1>No data available for this word</h1>
                                )}
                                <section className="silent-word">
                                    <h1>Set Silent Letters</h1>
                                    <section className="letter-list">
                                        <span>{formatWord(selectedWord)}</span>
                                    </section>
                                </section>
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
