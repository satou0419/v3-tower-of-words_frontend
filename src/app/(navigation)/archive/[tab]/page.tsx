"use client";
import Tab from "@/app/component/Tab/Tab";
import React, { useEffect, useState } from "react";
import "./archive.scss";
import { useRouter, usePathname } from "next/navigation";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import { InputLine } from "@/app/component/Input/Input";
import {
    useArchiveWordStore,
    fetchAndSetArchiveWords,
} from "@/store/archiveWordStore";
import dictionary from "@/lib/merriam-endpoint/dictionary";

export default function Archive() {
    const { archiveWords } = useArchiveWordStore();
    const router = useRouter();
    const pathname = usePathname();
    const pathSegments = pathname.split("/");

    const initialTab =
        pathSegments.length > 2 ? pathSegments[2] : "word-vocabulary";
    const [activeTab, setActiveTab] = useState<string>(initialTab);
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

    useEffect(() => {
        const currentPathSegments = pathname.split("/");
        const currentTab =
            currentPathSegments.length > 2 ? currentPathSegments[2] : "archive";
        setActiveTab(currentTab);
    }, [pathname]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/archive/${tab}`);
    };

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

    const tabData = [
        {
            title: "Words",
            id: "word-vocabulary",
            content: (
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
                                                        selectedWord
                                                            .dictionaryData
                                                            .phonetic
                                                    }
                                                </span>
                                                {selectedWord.dictionaryData
                                                    .audio && (
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
                                                selectedWord.dictionaryData
                                                    .meanings[0]?.partOfSpeech
                                            }
                                        </span>
                                        <span className="definition">
                                            {
                                                selectedWord.dictionaryData
                                                    .meanings[0]?.definitions[0]
                                                    .definition
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
            ),
        },
        {
            title: "Badges",
            id: "badges",
            content: (
                <section>
                    <h1>Badge</h1>
                </section>
            ),
        },
    ];

    return (
        <main className="archive-wrapper">
            <Tab
                tabs={tabData}
                currentTab={activeTab}
                onTabChange={handleTabChange}
            />
        </main>
    );
}
