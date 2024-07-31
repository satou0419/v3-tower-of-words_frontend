"use client";
import React from "react";
import CardTab from "@/app/component/Card/CardTab/CardTab";
import "./leaderboard.scss";
import CardSetting from "@/app/component/Card/CardSetting/CardSetting";
import CardUser from "@/app/component/Card/CardUser/CardUser";
import { useSimulationStore } from "@/store/simulationStore";
import { useRouter } from "next/navigation";


export default function Leaderboard() {
    const { currentSimulation } = useSimulationStore();
    const router = useRouter();

    const handleDelete = () => {
        console.log("Delete button clicked");
    };

    const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Form submitted");
    };

    const handleViewWordClick = () => {
        router.push("/teacher-word-added");
    };

    const users = [
        { username: "Rey Dante", time: "10:00 AM", score: 85 },
        { username: "Rey Mar", time: "10:05 AM", score: 90 },
        { username: "Gil Joshua", time: "10:10 AM", score: 95 },
        { username: "Jhon Lorenz", time: "10:15 AM", score: 88 },
        { username: "Anton Joseph", time: "10:20 AM", score: 92 },
        { username: "Trisha Mae", time: "10:25 AM", score: 87 },
    ];

    const inputSetting = [
        { type: "text", placeholder: "Update Simulation Name" },
        { type: "datetime-local", placeholder: "Update Time" },
    ];

    return (
        <main className="leaderboard-wrapper">
            <section className="leaderboard-container">
                <h1>Student Progress</h1>

                <section className="leaderboard-content">
                    <CardTab
                        className="leaderboard-card"
                        title="Leaderboard"
                        subtitle="Student Total: "
                        counter="69"
                    >
                        {currentSimulation.participants.map((participant, index) => (
                            <CardUser
                                key={index}
                                username={participant.userID.toString()}
                                time={participant.done ? participant.duration : "No Attempt!"}
                                score={participant.score}
                                className="custom-carduser"
                            />
                        ))}
                    </CardTab>

                    <section className="leaderboard-setting">
                        <div className="button-group">
                            <button type="button" onClick={handleViewWordClick}>View Words</button>
                            <button type="button">Create a Copy</button>
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
