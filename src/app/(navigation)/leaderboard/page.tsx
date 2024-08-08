"use client";
import React, { useEffect, useState } from "react";
import CardTab from "@/app/component/Card/CardTab/CardTab";
import "./leaderboard.scss";
import CardSetting from "@/app/component/Card/CardSetting/CardSetting";
import CardUser from "@/app/component/Card/CardUser/CardUser";
import { useSimulationStore } from "@/store/simulationStore";
import { useRouter, useSearchParams } from "next/navigation";
import { viewSimulation } from "@/lib/simulation-endpoint/viewSimulation";
import cloneGame from "@/lib/simulation-endpoint/cloneGame";
import Toast from "@/app/component/Toast/Toast";
import { useRoomStore } from "@/store/roomStore";
import useUserInfoStore from "@/store/userInfoStore";
import editSimulation from "@/lib/simulation-endpoint/editSimulation";

export default function Leaderboard() {
    const { currentRoom } = useRoomStore();
    const [newName, setNewName] = useState<string>("");
    const [newDeadline, setNewDeadline] = useState<string>("");
    const { userType } = useUserInfoStore.getState();
    const { currentSimulation, setCurrentSimulation } = useSimulationStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "warning">(
        "success"
    );

    const simulationIDParam = searchParams.get("simulationID");
    const simulationID = simulationIDParam
        ? parseInt(simulationIDParam, 10)
        : NaN;

    useEffect(() => {
        const fetchSimulations = async () => {
            try {
                const simulation = await viewSimulation(simulationID);
                setCurrentSimulation(simulation);
                console.log("hEKKI", simulation);
            } catch (error) {
                console.error(
                    "Failed to fetch simulations for the room:",
                    error
                );
            }
        };
        fetchSimulations();
    }, [setCurrentSimulation]);

    const handleDelete = () => {
        console.log("Delete button clicked");
    };

    const handleClone = async (simulation: any) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to create a copy of this simulation?"
        );
        if (isConfirmed) {
            try {
                if (currentRoom.roomID == 0 && userType) {
                    setToastMessage("Error cloning simulation");
                    setToastType("error");
                    router.push(`/${userType.toLowerCase()}-room`);
                    return;
                }
                await cloneGame(simulationID, currentRoom.roomID);
                setToastMessage("Simulation cloned successfully");
                setToastType("success");
            } catch (error) {
                setToastMessage("Error cloning simulation");
                setToastType("error");
            }
        } else {
            setToastMessage("Clone action canceled");
            setToastType("warning");
        }
    };

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!newName && !newDeadline) {
            setToastMessage("Input cannot be empty");
            setToastType("warning");
            return;
        }

        if (!newName) {
            try {
                await editSimulation({
                    simulationID,
                    name: currentSimulation.name,
                    deadline: newDeadline,
                });
                setToastMessage("Simulation updated successfully");
                setToastType("success");
            } catch (error) {
                setToastMessage("Error updating simulation");
                setToastType("error");
            }
        }

        if (!newDeadline) {
            try {
                await editSimulation({
                    simulationID,
                    name: newName,
                    deadline: currentSimulation.deadline,
                });
                setToastMessage("Simulation updated successfully");
                setToastType("success");
            } catch (error) {
                setToastMessage("Error updating simulation");
                setToastType("error");
            }
        }

        if (newDeadline && newName) {
            try {
                await editSimulation({
                    simulationID,
                    name: newName,
                    deadline: newDeadline,
                });
                setToastMessage("Simulation updated successfully");
                setToastType("success");
            } catch (error) {
                setToastMessage("Error updating simulation");
                setToastType("error");
            }
        }
    };

    const handleViewWordClick = () => {
        router.push(`/teacher-simulation-words?simulationID=${simulationID}`);
    };

    const handleGameAssessment = () => {
        router.push(`/game-assessment?simulationID=${simulationID}`);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(event.target.value);
    };

    const handleDeadlineChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewDeadline(event.target.value);
    };

    const handleStudentClick = (studentID: number) => {
        router.push(
            `/student-assessment?simulationID=${simulationID}&studentID=${studentID}`
        );
    };

    const inputSetting = [
        {
            type: "text",
            placeholder: "Update Simulation Name",
            value: newName,
            onChange: handleNameChange,
        },
        {
            type: "datetime-local",
            placeholder: "Update Time",
            value: newDeadline,
            onChange: handleDeadlineChange,
        },
    ];

    return (
        <main className="leaderboard-wrapper">
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}
            <section className="leaderboard-container">
                <h1>Student Progress</h1>

                <section className="leaderboard-content">
                    <CardTab
                        className="leaderboard-card"
                        title="Leaderboard"
                        subtitle="Student Total: "
                        counter={currentSimulation.participants.length.toString()}
                    >
                        {currentSimulation.participants.map(
                            (participant, index) => (
                                <CardUser
                                    key={index}
                                    username={participant.userID}
                                    time={
                                        participant.done
                                            ? participant.duration
                                            : "No Attempt!"
                                    }
                                    score={participant.score}
                                    className="custom-carduser"
                                    onClick={() =>
                                        handleStudentClick(participant.userID)
                                    }
                                />
                            )
                        )}
                    </CardTab>

                    <section className="leaderboard-setting">
                        <div className="button-group">
                            <button type="button" onClick={handleViewWordClick}>
                                View Words
                            </button>
                            <button
                                type="button"
                                onClick={() => handleClone(currentSimulation)}
                            >
                                Create a Copy
                            </button>
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                onClick={handleGameAssessment}
                            >
                                Game Assessment
                            </button>
                        </div>
                        <CardSetting
                            title="Settings"
                            inputs={inputSetting}
                            deleteButtonLabel="Delete"
                            saveButtonLabel="Save"
                            onDelete={handleDelete}
                            onSave={handleSave}
                            className="custom-cardsetting"
                        />
                    </section>
                </section>
            </section>
        </main>
    );
}
