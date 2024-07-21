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

const Words = () => {
    const { archiveWords } = useArchiveWordStore();
    const [selectedWord, setSelectedWord] = useState<null | string>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredWords, setFilteredWords] = useState(archiveWords);

    // Use the hook with the selectedWord to get Merriam data
    const wordData = useMerriam(selectedWord || "");

    useEffect(() => {
        fetchAndSetArchiveWords();
    }, []);

    useEffect(() => {
        setFilteredWords(
            archiveWords.filter((word) =>
                word.word.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, archiveWords]);

    const handleWordClick = (word: string) => {
        setSelectedWord(word);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

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
                        {filteredWords.map((word) => (
                            <span
                                key={word.word}
                                onClick={() => handleWordClick(word.word)}
                                className={
                                    selectedWord === word.word ? "active" : ""
                                }
                            >
                                {word.word}
                            </span>
                        ))}
                    </div>
                </div>
            </CardWord>
            <div className="wordarchive-spine"></div>
            <CardWord className="wordarchive-right">
                <section className="right-container">
                    {wordData ? (
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
                        <span>Select a word to see details</span>
                    )}
                </section>
            </CardWord>
        </section>
    );
};

export default Words;
