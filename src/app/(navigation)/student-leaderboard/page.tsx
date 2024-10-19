"use client";
import React, { useEffect, useState } from "react";
import CardTab from "@/app/component/Card/CardTab/CardTab";
import "./studentleaderboard.scss";
import CardSetting from "@/app/component/Card/CardSetting/CardSetting";
import CardUser from "@/app/component/Card/CardUser/CardUser";
import { useSimulationStore } from "@/store/simulationStore";
import { useRouter, useSearchParams } from "next/navigation";
import { viewSimulation } from "@/lib/simulation-endpoint/viewSimulation";

export default function StudentLeaderboard() {
    const { currentSimulation, setCurrentSimulation } = useSimulationStore();
    const router = useRouter();
    const searchParams = useSearchParams();
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

    const handleStudentClick = (studentID: number) => {
        router.push(
            `/student-assessment?simulationID=${simulationID}&studentID=${studentID}`
        );
    };

    return (
        <main className="leaderboard-wrapper">
            <section className="leaderboard-container">
                <section className="leaderboard-header">
                    <h1>Simulation Name: {currentSimulation.name}</h1>
                    <button
                        onClick={() => router.push("/dashboard")}
                        type="button"
                        className="wordassessment-button"
                    >
                        Back
                    </button>
                </section>

                <section className="leaderboard-content">
                    <CardTab
                        className="leaderboard-card"
                        title="Leaderboard"
                        subtitle="Student Total: "
                        counter={currentSimulation.participants.length.toString()}
                    >
                        {currentSimulation.participants
                            .sort((a, b) => {
                                if (b.score === a.score) {
                                    return b.accuracy - a.accuracy; // Sort by accuracy if scores are tied
                                }
                                return b.score - a.score; // Sort by score
                            })
                            .map((participant, index) => (
                                <CardUser
                                    key={index}
                                    index={index}
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
                            ))}
                    </CardTab>
                </section>
            </section>
        </main>
    );
}
