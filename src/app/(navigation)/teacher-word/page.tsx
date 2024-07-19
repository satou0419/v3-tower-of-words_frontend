"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import { InputBox, InputLine } from "@/app/component/Input/Input";
import "./teacherword.scss";
import withAuth from "@/app/withAuth";

interface Word {
    word: string;
    pronunciation: string;
    partOfSpeech: string;
    definition: string;
}

const words: Word[] = [
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

const TeacherWord = () => {
    const router = useRouter();
    const pathname = usePathname();
    const pathSegments = pathname.split("/");

    const initialTab =
        pathSegments.length > 2 ? pathSegments[2] : "word-vocabulary";
    const [activeTab, setActiveTab] = useState<string>(initialTab);
    const [selectedWord, setSelectedWord] = useState<Word>(words[5]); // Default to "Happy"
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredWords, setFilteredWords] = useState<Word[]>(words);
    const [selectedLetterIndices, setSelectedLetterIndices] = useState<
        number[]
    >([]);

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

    const handleWordClick = (word: Word) => {
        setSelectedWord(word);
        setSelectedLetterIndices([]); // Clear selected letters when a new word is selected
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const toggleSilentLetter = (index: number) => {
        if (selectedLetterIndices.includes(index)) {
            setSelectedLetterIndices(
                selectedLetterIndices.filter((idx) => idx !== index)
            );
        } else {
            setSelectedLetterIndices([...selectedLetterIndices, index]);
        }
    };

    return (
        <main className="main-wrapper">
            <button onClick={() => router.back()}>Back</button>
            <section className="wordarchive-container">
                <section className="left-section">
                    <section className="search-card">
                        <h1>Search words in Merriam</h1>
                        <InputBox
                            placeholder="Search word..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </section>
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
                </section>
                <CardWord className="wordarchive-right">
                    <section className="right-container">
                        <div className="word-control">
                            <button>Remove</button>
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
                        <section className="silent-word">
                            <h1>Set Silent Letters</h1>

                            <section className="letter-list">
                                {selectedWord.word
                                    .split("")
                                    .map((letter, index) => (
                                        <span
                                            key={index}
                                            className={
                                                selectedLetterIndices.includes(
                                                    index
                                                )
                                                    ? "selected"
                                                    : ""
                                            }
                                            onClick={() =>
                                                toggleSilentLetter(index)
                                            }
                                        >
                                            {letter.toUpperCase()}
                                        </span>
                                    ))}
                            </section>
                        </section>
                    </section>
                </CardWord>
            </section>
        </main>
    );
};

export default TeacherWord;
