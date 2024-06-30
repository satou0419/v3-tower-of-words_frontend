"use client";
import Tab from "@/app/component/Tab/Tab";
import React, { useEffect, useState } from "react";
import "./archive.scss";
import { useRouter, usePathname } from "next/navigation";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import { InputLine } from "@/app/component/Input/Input";

const words = [
    {
        word: "Jump",
        pronunciation: "[juhmp]",
        partOfSpeech: "verb",
        definition:
            "to push oneself off a surface and into the air by using the muscles in one's legs and feet.",
    },
    {
        word: "Run",
        pronunciation: "[ruhn]",
        partOfSpeech: "verb",
        definition:
            "move at a speed faster than a walk, never having both or all the feet on the ground at the same time.",
    },
    {
        word: "House",
        pronunciation: "[hous]",
        partOfSpeech: "noun",
        definition:
            "a building for human habitation, especially one that is lived in by a family or small group of people.",
    },
    {
        word: "Friend",
        pronunciation: "[frend]",
        partOfSpeech: "noun",
        definition:
            "a person whom one knows and with whom one has a bond of mutual affection, typically exclusive of sexual or family relations.",
    },
    {
        word: "Water",
        pronunciation: "[waw-ter]",
        partOfSpeech: "noun",
        definition:
            "a colorless, transparent, odorless liquid that forms the seas, lakes, rivers, and rain and is the basis of the fluids of living organisms.",
    },
    {
        word: "Happy",
        pronunciation: "['ha-pe']",
        partOfSpeech: "adjective",
        definition: "feeling or showing pleasure or contentment.",
    },
    {
        word: "Family",
        pronunciation: "[fam-uh-lee]",
        partOfSpeech: "noun",
        definition:
            "a group consisting of parents and children living together in a household.",
    },
    {
        word: "Bicycle",
        pronunciation: "[bahy-si-kuhl]",
        partOfSpeech: "noun",
        definition:
            "a vehicle composed of two wheels held in a frame one behind the other, propelled by pedals and steered with handlebars attached to the front wheel.",
    },
    {
        word: "Celebrate",
        pronunciation: "[sel-uh-breyt]",
        partOfSpeech: "verb",
        definition:
            "acknowledge (a significant or happy day or event) with a social gathering or enjoyable activity.",
    },
];

export default function Archive() {
    const router = useRouter();
    const pathname = usePathname();
    const pathSegments = pathname.split("/");

    const initialTab =
        pathSegments.length > 2 ? pathSegments[2] : "word-vocabulary";
    const [activeTab, setActiveTab] = useState<string>(initialTab);
    const [selectedWord, setSelectedWord] = useState(words[5]); // Default to "Happy"
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredWords, setFilteredWords] = useState(words);

    useEffect(() => {
        const currentPathSegments = pathname.split("/");
        const currentTab =
            currentPathSegments.length > 2 ? currentPathSegments[2] : "archive";
        setActiveTab(currentTab);
    }, [pathname]);

    useEffect(() => {
        setFilteredWords(
            words.filter((word) =>
                word.word.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/archive/${tab}`);
    };

    const handleWordClick = (word: (typeof words)[0]) => {
        setSelectedWord(word);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
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
                                            word.word === selectedWord.word
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
                            <div className="word-control">
                                <h1>{selectedWord.word}</h1>
                                <span className="pronunciation">
                                    {selectedWord.pronunciation}
                                </span>
                                <span>Play</span>
                            </div>

                            <div className="word-define">
                                <span className="part-of-speech">
                                    {selectedWord.partOfSpeech}
                                </span>
                                <span className="definition">
                                    {selectedWord.definition}
                                </span>
                            </div>
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
