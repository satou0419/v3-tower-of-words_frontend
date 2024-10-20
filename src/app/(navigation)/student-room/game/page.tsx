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
    const [isModalDoneOpen, setIsModalDoneOpen] = useState(false);

    const handleCardClick = (simulationID: number, isDone: boolean) => {
        if (isDone) {
            console.log("BOGO MANA KA!");
            setIsModalDoneOpen(true);
            return;
        }
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

    const handleDone = () => {
        setIsModalDoneOpen(false);
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

                            const isDone = participant
                                ? participant.done
                                : false;

                            return (
                                <CardRoomGame
                                    key={simulation.simulationID}
                                    bannerClass="/assets/images/banner/banner-knight.png"
                                    title={simulation.name}
                                    description={
                                        user.studentInfo?.data?.username ??
                                        "Teacher"
                                    }
                                    infoTitle="Score"
                                    counter={score}
                                    glow={false}
                                    onClick={() =>
                                        handleCardClick(
                                            simulation.simulationID,
                                            isDone
                                        )
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
                title="Simulation Already Completed!"
                isOpen={isModalDoneOpen}
                onClose={handleDone}
                className="error-modal"
                buttons={[
                    <button key="cancel" onClick={handleDone}>
                        Done
                    </button>,
                ]}
            >
                This simulation has already been completed. Please select
                another one!
            </Modal>

            <Modal
                title="Confirm Simulation Entry"
                isOpen={isModalOpen}
                onClose={handleCancel}
                className="confirmation-modal"
                buttons={[
                    <button key="cancel" onClick={handleCancel}>
                        Cancel
                    </button>,
                    simulationDetails && simulationDetails.simulationDetails ? (
                        <button key="confirm" onClick={handleConfirm}>
                            Confirm
                        </button>
                    ) : (
                        <Loading key="loading" />
                    ),
                ]}
            >
                {simulationDetails && simulationDetails.simulationDetails ? (
                    <p>Are you sure you want to enter this simulation?</p>
                ) : (
                    <p>Loading simulation details...</p>
                )}
            </Modal>
        </main>
    );
}
