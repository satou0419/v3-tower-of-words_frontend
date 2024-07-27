"use client";

import { useEffect, useState } from "react";
import { useSimulationStore } from "@/store/simulationStore";
import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./game.scss";
import useUserInfoStore from "@/store/userInfoStore";
import viewRoomSimulations from "@/lib/simulation-endpoint/viewRoomSimulations";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/loading"; // Import the Loading component

export default function Game() {
    const { userType } = useUserInfoStore.getState();
    const { simulations, setSimulation } = useSimulationStore(); // Assuming you have a setSimulation method
    const searchParams = useSearchParams(); // Get the search parameters
    const [loading, setLoading] = useState(true); // Loading state

    const roomIDParam = searchParams.get("roomID");
    const roomID = roomIDParam ? parseInt(roomIDParam, 10) : NaN;

    useEffect(() => {
        const fetchSimulations = async () => {
            try {
                const data = await viewRoomSimulations(roomID);
                setSimulation(data);
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
                        simulations.map((simulation) => (
                            <CardRoomGame
                                key={simulation.simulationID}
                                bannerClass="room-banner"
                                title={simulation.name}
                                description={`Teacher Name`} // Replace with actual data if available
                                infoTitle="Score" // Replace with actual data if available
                                counter={simulation.numberOfAttempt}
                                glow={false}
                                onClick={() =>
                                    handleCardClick(simulation.simulationID)
                                } // Pass simulationID to the handler
                            />
                        ))
                    ) : (
                        <p>No simulations available</p>
                    )}
                </div>
            </section>
        </main>
    );
}
