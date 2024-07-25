"use client";

import CardTab from "@/app/component/Card/CardTab/CardTab";
import "./roominformation.scss";
import CardUser from "@/app/component/Card/CardUser/CardUser";
import CardSetting from "@/app/component/Card/CardSetting/CardSetting";
import useUsernameToID from "@/hook/useUsernameToID";
import insertStudent from "@/lib/room-endpoint/insertStudent";
import { useState } from "react";
import { useRoomStore } from "@/store/roomStore";

export default function RoomInformation() {
    const [username, setUsername] = useState<string>("");
    const { usernameToID } = useUsernameToID();
    const { currentRoom } = useRoomStore();

    const handleDelete = () => {
        console.log("Delete button clicked");
        // Handle delete action
    };

    const handleSaveAddStudent = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        if (username.trim()) {
            try {
                const response = await usernameToID(username);
                insertStudent(response, currentRoom);
                console.log("User ID fetched for", username, ":", response);
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        } else {
            console.log("No username provided");
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
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

    const inputAddStudent = [
        {
            type: "text",
            placeholder: "Add Student",
            value: username,
            onChange: handleInputChange,
        },
    ];

    return (
        <main className="roominformation-wrapper">
            <section className="roominformation-container">
                <h1>Room Settings</h1>

                <section className="roominformation-content">
                    <CardTab
                        className="roominformation-card"
                        title="roominformation"
                        subtitle="Student Total: "
                        counter="69"
                    >
                        {users.map((user, index) => (
                            <CardUser
                                key={index}
                                username={user.username}
                                time={user.time}
                            />
                        ))}
                    </CardTab>

                    <section className="roominformation-setting">
                        <CardSetting
                            title="Settings"
                            inputs={inputSetting}
                            deleteButtonLabel="Delete"
                            saveButtonLabel="Save"
                            onDelete={handleDelete}
                            onSave={handleDelete}
                            className="custom-cardsetting"
                        />

                        <CardSetting
                            title="Add Student"
                            inputs={inputAddStudent}
                            deleteButtonLabel="Delete"
                            saveButtonLabel="Save"
                            onDelete={handleDelete}
                            onSave={handleSaveAddStudent}
                            className="custom-cardsetting"
                        />
                    </section>
                </section>
            </section>
        </main>
    );
}
