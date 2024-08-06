"use client";

import CardWord from "@/app/component/Card/CardWord/CardWord";
import "./studentwordprogress.scss";
import { InputLine } from "@/app/component/Input/Input";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSimulationStore } from "@/store/simulationStore";
import useFetchAllSimulationWords from "@/hook/useAllSimulationWords";
import useMerriam from "@/hook/useMerriam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import CardTab from "@/app/component/Card/CardTab/CardTab";
import viewStudentWordProgress from "@/lib/assessment-endpoint/viewStudentWordProgress";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);

export default function StudentWordProgress() {
    const [assessmentData, setAssessmentData] = useState<any>(null);
    const [ simulationWordsID, setSimulationWordsID ] = useState<number[]>([]);
    const router = useRouter();
    const [showGraph, setShowGraph] = useState(false); 
    const searchParams = useSearchParams();
    const simulationIDParam = searchParams.get("simulationID");
    const simulationID = simulationIDParam ? parseInt(simulationIDParam, 10) : NaN;

    const studentIDParam = searchParams.get("studentID");
    const studentID = studentIDParam ? parseInt(studentIDParam, 10) : NaN;

    const [selectedWord, setSelectedWord] = useState<null | string>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const simulationWords = useFetchAllSimulationWords(simulationWordsID).simulationWords;
    const [filteredWords, setFilteredWords] = useState(simulationWords);

    const wordData = useMerriam(selectedWord || "");

    console.log(assessmentData);

    useEffect(() => {
        const fetchSimulations = async () => {
            try {
                const simulation = await viewStudentWordProgress(simulationID, studentID);
                if (Array.isArray(simulation)) {
                    setAssessmentData(simulation);
                } else {
                    console.error("Unexpected response format:", simulation);
                }
            } catch (error) {
                console.error("Failed to fetch simulations for the room:", error);
            }
        };
        fetchSimulations();
    }, [studentID, simulationID]);

    useEffect(() => {
        if (assessmentData) {
            const wordsID = assessmentData.map((item: any) => item.simulationWordsID);
            setSimulationWordsID(wordsID);
        }
    }, [assessmentData]);

    useEffect(() => {
        const updatedFilteredWords = simulationWords.filter((word) =>
            word.word.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredWords(updatedFilteredWords);
        if (updatedFilteredWords.length > 0) {
            if (
                selectedWord === null ||
                !updatedFilteredWords.some((word) => word.word === selectedWord)
            ) {
                setSelectedWord(updatedFilteredWords[0].word);
            }
        } else {
            setSelectedWord(null);
        }
    }, [searchTerm, simulationWords]);

    const handleWordClick = (word: string) => {
        setSelectedWord(word);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const selectedWordID = simulationWords.find(word => word.word === selectedWord)?.simulationWordsID;

    const selectedAssessment = assessmentData?.find(
        (assessment: any) => assessment.simulationWordsID === selectedWordID
    );

    console.log(selectedAssessment)

    const chartData = {
        labels: selectedAssessment
        ? [
            `Accuracy: ${selectedAssessment.accuracy.toFixed(2)}`,
            `Mistake: ${selectedAssessment.mistake}`,
            `Duration: ${selectedAssessment.duration}`,
            `Score: ${selectedAssessment.score}`,
        ]
        : ['Accuracy', 'Mistake', 'Duration', 'Score'],
        datasets: [
            {
                label: 'Assessment Data',
                data: selectedAssessment
                    ? [selectedAssessment.accuracy, selectedAssessment.mistake, selectedAssessment.duration, selectedAssessment.score]
                    : [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <main className="main-wrapper">
            <button onClick={() => router.back()} type="button" className="studentwordprogress-button">Back</button>
            <section className="studentwordprogress-container">
                <CardWord className="studentwordprogress-left">
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
                                        selectedWord === word.word
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
                <CardWord className="studentwordprogress-right">
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
                            <div className="graph-button">
                                <button
                                    type="button"
                                    onClick={() => setShowGraph(!showGraph)}
                                    className="show-graph-button"
                                >
                                    {showGraph ? 'Hide Graph' : 'Show Graph'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <span className="no-data">No data available</span>
                    )}
                    </section>
                </CardWord>
                {selectedAssessment && showGraph && (
                    <div className="graph">
                        <button onClick={() => setShowGraph(!showGraph)} type="button" className="studentwordprogress-x">X</button>
                        <CardTab
                            className="cardtab"
                            title="Word Assessment"
                            subtitle={selectedWord || undefined}
                        >
                            <section className="studentwordprogress-content">
                                <section className="studentwordprogress-details">
                                    <span className="studentwordprogress-data">
                                        <div>Accuracy</div> 
                                        <div>{selectedAssessment.accuracy}</div>
                                    </span>
                                    <span className="studentwordprogress-data">
                                        <div>Mistake</div>
                                        <div>{selectedAssessment.mistake}</div>
                                    </span>
                                    <span className="studentwordprogress-data">
                                        <div>Duration</div>
                                        <div>{selectedAssessment.duration}</div>
                                    </span>
                                    <span className="studentwordprogress-data">
                                        <div>Score</div>
                                        <div>{selectedAssessment.score}</div>
                                    </span>
                                </section>

                                <section className="studentwordprogress-graph">
                                    <Bar data={chartData} />
                                </section>
                            </section>
                        </CardTab>
                    </div>
                )}
            </section>
        </main>
    );
}
