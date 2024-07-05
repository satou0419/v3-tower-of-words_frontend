"use client";
import React from "react";
import CardTab from "@/app/component/Card/CardTab/CardTab";
import "./leaderboard.scss";
import CardSetting from "@/app/component/Card/CardSetting/CardSetting";
import CardUser from "@/app/component/Card/CardUser/CardUser";

export default function Leaderboard() {
    const handleDelete = () => {
        console.log("Delete button clicked");
    };

    const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Form submitted");
    };
    const users = [
        { username: "Rey Dante", time: "10:00 AM", score: 85 },
        { username: "Rey Mar", time: "10:05 AM", score: 90 },
        { username: "Gil Joshua", time: "10:10 AM", score: 95 },
        { username: "Jhon Lorenz", time: "10:15 AM", score: 88 },
        { username: "Anton Joseph", time: "10:20 AM", score: 92 },
        { username: "Trisha Mae", time: "10:25 AM", score: 87 },
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
                        {users.map((user, index) => (
                            <CardUser
                                key={index}
                                username={user.username}
                                time={user.time}
                                score={user.score}
                                className="custom-carduser"
                            />
                        ))}
                    </CardTab>

                    <section className="leaderboard-setting">
                        <div className="button-group">
                            <button type="button">View Words</button>
                            <button type="button">Create a Copy</button>
                        </div>
                        <CardSetting
                            title="Settings"
                            namePlaceholder="Update Simulation Name"
                            timePlaceholder="Update Time"
                            deleteButtonLabel="Delete"
                            saveButtonLabel="Save"
                            onDelete={handleDelete}
                            onSave={handleSave}
                        />
                    </section>
                </section>
            </section>
        </main>
    );
}
