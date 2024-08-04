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

export default function Leaderboard() {
    const { currentSimulation, setCurrentSimulation } = useSimulationStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "warning">(
        "success"
    );

    const simulationIDParam = searchParams.get("simulationID");
    const simulationID = simulationIDParam ? parseInt(simulationIDParam, 10) : NaN;

    useEffect(() => {
        const fetchSimulations = async () => {
        try {
            const simulation = await viewSimulation(simulationID);
            setCurrentSimulation(simulation);
            console.log(simulation);
        } catch (error) {
            console.error("Failed to fetch simulations for the room:", error);
        }
    };
        fetchSimulations();
    }, [setCurrentSimulation]);

    const handleDelete = () => {
        console.log("Delete button clicked");
    };

    const handleClone = async ( simulation: any ) => {
        const isConfirmed = window.confirm("Are you sure you want to create a copy of this simulation?");
        if (isConfirmed) {
            try {
                await cloneGame(simulation);
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


    const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Form submitted");
    };

    const handleViewWordClick = () => {
        router.push(`/teacher-simulation-words?simulationID=${simulationID}`);
    };

    const inputSetting = [
        { type: "text", placeholder: "Update Simulation Name" },
        { type: "datetime-local", placeholder: "Update Time" },
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
                        {currentSimulation.participants.map((participant, index) => (
                            <CardUser
                                key={index}
                                username={participant.userID}
                                time={participant.done ? participant.duration : "No Attempt!"}
                                score={participant.score}
                                className="custom-carduser"
                            />
                        ))}
                    </CardTab>

                    <section className="leaderboard-setting">
                        <div className="button-group">
                            <button type="button" onClick={handleViewWordClick}>View Words</button>
                            <button type="button" onClick={() => handleClone(currentSimulation)}>Create a Copy</button>
                        </div>

                        <div className="button-group">
                            <button type="button" >Game Assessment</button>
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
