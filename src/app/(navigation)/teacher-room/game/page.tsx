"use client";

import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./game.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";
import { useSimulationStore } from "@/store/simulationStore";
import { useRoomStore } from "@/store/roomStore";
import { useRouter } from "next/navigation";

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
    const { currentRoom } = useRoomStore();
    const { simulations, setCurrentSimulation } = useSimulationStore();
    const router = useRouter();

    console.log(simulations);

    const handleCardClick = async (simulation: SimulationDetails) => {
        setCurrentSimulation(simulation);
        router.push("/leaderboard");
    };

    const handleRoomInfoClick = () => {
        router.push("/room-information");
    };

    return (
        <main className="game-wrapper">
            <section className="game-container">
                <section className="game-control">
                    <h1>
                        {currentRoom.name} - Simulations | {currentRoom.code}
                    </h1>
                    <button onClick={handleRoomInfoClick}>
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
                            counter={4}
                            glow={false}
                            onClick={() => handleCardClick(simulation)}
                        />
                    ))}
                    <CardNew title="+ Create Game" link={`/game-mode`} />
                </div>
            </section>
        </main>
    );
}
