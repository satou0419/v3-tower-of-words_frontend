"use client";

import React, { useEffect, useState } from "react";
import { InputLine } from "@/app/component/Input/Input";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import {
    useArchiveWordStore,
    fetchAndSetArchiveWords,
} from "@/store/archiveWordStore";
import useMerriam from "@/hook/useMerriam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/loading"; // Import the Loading component

const Words = () => {
    const { archiveWords } = useArchiveWordStore();
    const [selectedWord, setSelectedWord] = useState<null | string>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredWords, setFilteredWords] = useState(archiveWords);
    const [loading, setLoading] = useState(true);

    // Use the hook with the selectedWord to get Merriam data
    const wordData = useMerriam(selectedWord || "");

    useEffect(() => {
        const fetchWords = async () => {
            try {
                await fetchAndSetArchiveWords();
            } finally {
                setLoading(false);
            }
        };

        fetchWords();
    }, []);

    useEffect(() => {
        const updatedFilteredWords = archiveWords.filter((word) =>
            word.word.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredWords(updatedFilteredWords);

        // If search results are found and no word is selected, select the first word
        if (updatedFilteredWords.length > 0) {
            if (
                selectedWord === null ||
                !updatedFilteredWords.some((word) => word.word === selectedWord)
            ) {
                setSelectedWord(updatedFilteredWords[0].word);
            }
        } else {
            // Clear the selected word if no results
            setSelectedWord(null);
        }
    }, [searchTerm, archiveWords]);

    const handleWordClick = (word: string) => {
        setSelectedWord(word);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    if (loading) {
        // return <Loading />; // Render Loading component while data is being loaded
    }

    return (
        <section className="wordarchive-container">
            <CardWord className="wordarchive-left">
                <div className="left-container">
                    <InputLine
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <div className="word-list">
                        {filteredWords.length > 0 ? (
                            filteredWords.map((word) => (
                                <span
                                    key={word.word}
                                    onClick={() => handleWordClick(word.word)}
                                    className={
                                        selectedWord === word.word
                                            ? "active"
                                            : ""
                                    }
                                >
                                    {word.word}
                                </span>
                            ))
                        ) : (
                            <span className="no-results">No words found</span>
                        )}
                    </div>
                </div>
            </CardWord>
            <div className="wordarchive-spine"></div>
            <CardWord className="wordarchive-right">
                <section className="right-container">
                    {selectedWord && wordData ? (
                        <>
                            <div className="word-control">
                                <h1>{wordData.word}</h1>
                                {wordData.pronunciation && (
                                    <span className="pronunciation">
                                        {wordData.pronunciation}
                                    </span>
                                )}
                                {wordData.audio && (
                                    <FontAwesomeIcon
                                        className="play-audio-icon"
                                        icon={faVolumeUp}
                                        onClick={() => wordData.playAudio()}
                                    />
                                )}
                            </div>
                            <div className="word-define">
                                {wordData.partOfSpeech && (
                                    <span className="part-of-speech">
                                        {wordData.partOfSpeech}
                                    </span>
                                )}
                                {wordData.definition && (
                                    <span className="definition">
                                        {wordData.definition}
                                    </span>
                                )}
                                {wordData.message && (
                                    <div className="message">
                                        {wordData.message}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <span className="no-data">No data available</span>
                    )}
                </section>
            </CardWord>
        </section>
    );
};

export default Words;
