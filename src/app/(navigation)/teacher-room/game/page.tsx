"use client";

import { useEffect } from "react";
import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./game.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";
import { useSimulationStore } from "@/store/simulationStore";
import { useRoomStore } from "@/store/roomStore";
import { useRouter, useSearchParams } from "next/navigation";
import viewRoomSimulations from "@/lib/simulation-endpoint/viewRoomSimulations";
import { viewRoom } from "@/lib/room-endpoint/viewRoom";

interface Enemy {
    imagePath: string;
    words: number[];
}

interface SimulationParticipant {
    simulationParticipantsID: number;
    userID: number;
    score: number;
    duration: string | null;
    attempts: number;
    accuracy: number;
    wordsProgress: any[];
    done: boolean;
}

interface SimulationAssessment {
    simulationWordAssessmentID: number;
    simulationID: number;
    simulationEnemyID: number;
    simulationWordID: number;
    accuracy: number;
    attempts: number;
    score: number;
    duration: number;
}

interface SimulationDetails {
    simulationID: number;
    simulationType: string;
    name: string;
    deadline: string;
    attackInterval: number;
    studentLife: number;
    numberOfAttempt: number;
    items: boolean;
    description: boolean;
    pronunciation: boolean;
    enemy: Enemy[];
    participants: SimulationParticipant[];
    assessment: SimulationAssessment[];
}

export default function Game() {
    const { currentRoom, setCurrentRoom } = useRoomStore();
    const { simulations, setCurrentSimulation, setSimulation } = useSimulationStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    const roomIDParam = searchParams.get("roomID");
    const roomID = roomIDParam ? parseInt(roomIDParam, 10) : NaN;

    console.log(simulations);

    useEffect(() => {
        const fetchSimulations = async () => {
        try {
            const roomSimulation = await viewRoomSimulations(roomID);
            const room = await viewRoom(roomID);
            setSimulation(roomSimulation);
            setCurrentRoom(room);
            console.log(roomSimulation);
        } catch (error) {
            console.error("Failed to fetch simulations for the room:", error);
        }
    };
        fetchSimulations();
    }, [setSimulation, setCurrentRoom]);

    const handleCardClick = async (simulation: SimulationDetails) => {
        setCurrentSimulation(simulation);
        router.push(`/leaderboard?simulationID=${simulation.simulationID}`);
    };

    const handleRoomInfoClick = async (roomID: number) => {
        router.push(`/room-information?roomID=${roomID}`);
    };

    return (
        <main className="game-wrapper">
            <section className="game-container">
                <section className="game-control">
                    <h1>
                        {currentRoom.name} - Simulations | {currentRoom.code}
                    </h1>
                    <button onClick={() =>handleRoomInfoClick(roomID)}>
                        Room Information
                    </button>
                </section>

                <div className="game-room">
                    {simulations.map((simulation) => (
                        <CardRoomGame
                            key={simulation.simulationID}
                            bannerClass="room-banner"
                            title={simulation.name}
                            description={simulation.simulationType}
                            infoTitle="Student Done"
                            counter={simulation.participants.filter((p) => p.done).length}
                            glow={false}
                            onClick={() => handleCardClick(simulation)}
                        />
                    ))}
                    <CardNew title="+ Create Game" link={`/game-mode?roomID=${roomID}`} />
                </div>
            </section>
        </main>
    );
}
