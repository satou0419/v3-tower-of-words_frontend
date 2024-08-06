"use client";

import { useEffect, useState } from "react";
import { useSimulationStore } from "@/store/simulationStore";
import { useRoomStore } from "@/store/roomStore";
import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./game.scss";
import { useAuthStore } from "@/store/authStore";
import viewRoomSimulations from "@/lib/simulation-endpoint/viewRoomSimulations";
import { viewRoom } from "@/lib/room-endpoint/viewRoom";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/loading";
import useStudentInfo from "@/hook/useStudentInfo";

export default function Game() {
    const { userID } = useAuthStore.getState();
    const { currentRoom, setCurrentRoom } = useRoomStore();
    const { simulations, setSimulation } = useSimulationStore();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);

    const roomIDParam = searchParams.get("roomID");
    const roomID = roomIDParam ? parseInt(roomIDParam, 10) : NaN;

    const user = useStudentInfo(currentRoom.creatorID);

    console.log(user.studentInfo?.data?.username);

    useEffect(() => {
        const fetchSimulations = async () => {
            try {
                const data = await viewRoomSimulations(roomID);
                const room = await viewRoom(roomID);
                setSimulation(data);
                setCurrentRoom(room);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Failed to fetch simulations:", error);
                setLoading(false); // Set loading to false even if there's an error
            }
        };

        fetchSimulations();
    }, [setSimulation, roomID]);

    const navigation = useRouter();

    const handleCardClick = (simulationID: number) => {
        navigation.push(`/gameplay/simulation?simulationID=${simulationID}`);
    };

    if (loading) {
        return <Loading />; // Render Loading component while fetching data
    }

    return (
        <main className="game-wrapper">
            <section className="game-container">
                <section className="game-control">
                    <h1>
                        Simulation -{" "}
                        {simulations.length > 0
                            ? simulations[0].name
                            : "No Simulation"}
                    </h1>
                </section>

                <div className="game-room">
                    {simulations.length > 0 ? (
                        simulations.map((simulation) =>{
                            const participant = simulation.participants.find(participant => participant.userID === userID);
                            const score = participant ? participant.score : 0; // Get the score if participant found

                            return (
                                <CardRoomGame
                                    key={simulation.simulationID}
                                    bannerClass="room-banner"
                                    title={simulation.name}
                                    description={user.studentInfo?.data?.username ?? "Teacher"}
                                    infoTitle="Score"
                                    counter={score}
                                    glow={false}
                                    onClick={() =>
                                        handleCardClick(simulation.simulationID)
                                    }
                                />
                            );
                        })
                    ) : (
                        <p>No simulations available</p>
                    )}
                </div>
            </section>
        </main>
    );
}
