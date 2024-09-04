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
import useSimulationDetails from "@/hook/useSimulationDetails";
import Modal from "@/app/component/Modal/Modal";

export default function Game() {
    const { userID } = useAuthStore.getState();
    const { currentRoom, setCurrentRoom } = useRoomStore();
    const { simulations, setSimulation } = useSimulationStore();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);

    const roomIDParam = searchParams.get("roomID");
    const roomID = roomIDParam ? parseInt(roomIDParam, 10) : NaN;

    const user = useStudentInfo(currentRoom.creatorID);

    useEffect(() => {
        const fetchSimulations = async () => {
            try {
                const data = await viewRoomSimulations(roomID);
                const room = await viewRoom(roomID);
                setSimulation(data);
                setCurrentRoom(room);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch simulations:", error);
                setLoading(false);
            }
        };

        fetchSimulations();
    }, [setSimulation, roomID]);

    const navigation = useRouter();
    const [selectedSimulationID, setSelectedSimulationID] = useState<
        number | null
    >(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (simulationID: number) => {
        console.log("Clicked Simulation ID:", simulationID);
        setSelectedSimulationID(simulationID);
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        if (selectedSimulationID !== null) {
            const attackInterval =
                simulationDetails.simulationDetails?.attackInterval || 0;
            navigation.push(
                `/gameplay/simulation?simulationID=${selectedSimulationID}&attackInterval=${attackInterval}`
            );
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const simulationDetails = useSimulationDetails(selectedSimulationID || 0);

    useEffect(() => {
        console.log("Simulation Details:", simulationDetails);
    }, [simulationDetails]);

    if (loading) {
        return <Loading />;
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
                        simulations.map((simulation) => {
                            const participant = simulation.participants.find(
                                (participant) => participant.userID === userID
                            );
                            const score = participant ? participant.score : 0;

                            return (
                                <CardRoomGame
                                    key={simulation.simulationID}
                                    bannerClass="room-banner"
                                    title={simulation.name}
                                    description={
                                        user.studentInfo?.data?.username ??
                                        "Teacher"
                                    }
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

            <Modal
                title="Confirm Simulation Entry"
                isOpen={isModalOpen}
                onClose={handleCancel}
                className="confirmation-modal"
                buttons={[
                    <button key="cancel" onClick={handleCancel}>
                        Cancel
                    </button>,
                    <button key="confirm" onClick={handleConfirm}>
                        Confirm
                    </button>,
                ]}
            >
                <p>Are you sure you want to enter this simulation?</p>
            </Modal>
        </main>
    );
}
