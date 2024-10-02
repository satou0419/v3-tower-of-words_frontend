"use client";

import CardTab from "@/app/component/Card/CardTab/CardTab";
import "./roominformation.scss";
import CardUser from "@/app/component/Card/CardUser/CardUser";
import CardSetting from "@/app/component/Card/CardSetting/CardSetting";
import useUsernameToID from "@/hook/useUsernameToID";
import insertStudent from "@/lib/room-endpoint/insertStudent";
import { useState, useEffect } from "react";
import { useRoomStore } from "@/store/roomStore";
import { viewRoom } from "@/lib/room-endpoint/viewRoom";
import { useSearchParams } from "next/navigation";
import renameRoom from "@/lib/room-endpoint/renameRoom";
import Toast from "@/app/component/Toast/Toast";

export default function RoomInformation() {
    const [username, setUsername] = useState<string>("");
    const [newRoomName, setNewRoomName] = useState<string>("");
    const { usernameToID } = useUsernameToID();
    const searchParams = useSearchParams();
    const { currentRoom, setCurrentRoom } = useRoomStore();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "warning">(
        "success"
    );

    const roomIDParam = searchParams.get("roomID");
    const roomID = roomIDParam ? parseInt(roomIDParam, 10) : NaN;

    useEffect(() => {
        const fetchSimulations = async () => {
            try {
                const room = await viewRoom(roomID);
                setCurrentRoom(room);
            } catch (error) {
                console.error(
                    "Failed to fetch simulations for the room:",
                    error
                );
            }
        };
        fetchSimulations();
    }, [setCurrentRoom]);

    const handleDelete = () => {
        console.log("Delete button clicked");
        // Handle delete action
    };

    const handleReset = () => {
        console.log("Delete button clicked");
        setUsername("");
    };

    const handleRename = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!newRoomName.trim()) {
            console.log("Room name cannot be empty");
            setToastMessage("Room name cannot be empty.");
            setToastType("warning");
            return;
        }

        try {
            await renameRoom({ roomID, name: newRoomName });
            setToastMessage("Room renamed successfully");
            setToastType("success");
        } catch (error) {
            setToastMessage("Failed to rename room");
            setToastType("error");
        }
    };

    const handleSaveAddStudent = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        if (username.trim()) {
            try {
                const userID = await usernameToID(username);

                const userExistsInRoom = currentRoom.members.some(
                    (member) => member === userID
                );

                if (userExistsInRoom) {
                    console.log("User already exists in the room");
                    setToastMessage("User already exists in the room.");
                    setToastType("error");
                } else {
                    await insertStudent(userID, currentRoom);
                    setToastMessage("User added successfully.");
                    setToastType("success");
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        } else {
            setToastMessage("No username provided");
            setToastType("warning");
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleInputRename = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewRoomName(event.target.value);
    };

    const inputSetting = [
        {
            type: "text",
            placeholder: "Update Room Name",
            value: newRoomName,
            onChange: handleInputRename,
        },
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
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}
            <section className="roominformation-container">
                <h1>Room Settings</h1>

                <section className="roominformation-content">
                    <CardTab
                        className="roominformation-card"
                        title="Student Room Information"
                        subtitle="Student Total: "
                        counter={currentRoom.members.length.toString()}
                    >
                        {currentRoom.members.map((user, index) => (
                            <CardUser
                                key={index}
                                username={user}
                                className="custom-carduser"
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
                            onSave={handleRename}
                            className="custom-cardsetting"
                        />

                        <CardSetting
                            title="Add Student"
                            inputs={inputAddStudent}
                            deleteButtonLabel="Reset"
                            saveButtonLabel="Save"
                            onDelete={handleReset}
                            onSave={handleSaveAddStudent}
                            className="custom-cardsetting"
                        />
                    </section>
                </section>
            </section>
        </main>
    );
}
