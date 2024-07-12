import React, { useEffect, useState } from "react";
import { InputLine } from "@/app/component/Input/Input";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import {
    useArchiveWordStore,
    fetchAndSetArchiveWords,
} from "@/store/archiveWordStore";
import dictionary from "@/lib/merriam-endpoint/dictionary";

const Words = () => {
    const { archiveWords } = useArchiveWordStore();
    const [selectedWord, setSelectedWord] = useState<null | any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredWords, setFilteredWords] = useState(archiveWords);

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

    const handleWordClick = async (word: any) => {
        const dictionaryData = await dictionary(word.word);
        setSelectedWord({
            ...word,
            dictionaryData,
        });
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const playAudio = (audioUrl: string) => {
        const audio = new Audio(audioUrl);
        audio.play();
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
                                onClick={() => handleWordClick(word)}
                                className={
                                    selectedWord &&
                                    selectedWord.word === word.word
                                        ? "active"
                                        : ""
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
                    {selectedWord ? (
                        <>
                            <div className="word-control">
                                <h1>{selectedWord.word}</h1>
                                {selectedWord.dictionaryData && (
                                    <>
                                        <span className="pronunciation">
                                            {
                                                selectedWord.dictionaryData
                                                    .phonetic
                                            }
                                        </span>
                                        {selectedWord.dictionaryData.audio && (
                                            <button
                                                onClick={() =>
                                                    playAudio(
                                                        selectedWord
                                                            .dictionaryData
                                                            .audio
                                                    )
                                                }
                                            >
                                                Play Audio
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="word-define">
                                <span className="part-of-speech">
                                    {
                                        selectedWord.dictionaryData.meanings[0]
                                            ?.partOfSpeech
                                    }
                                </span>
                                <span className="definition">
                                    {
                                        selectedWord.dictionaryData.meanings[0]
                                            ?.definitions[0]?.definition
                                    }
                                </span>
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
