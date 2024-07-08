"use client";
import React, { useState } from "react";
import { InputLine } from "@/app/component/Input/Input";

import "./createroom.scss";
import { useRoomStore } from "@/store/roomStore";
import { createRoom } from "@/lib/room-endpoint/createRoom";

export default function CreateRoom() {
    const { rooms, setRoom } = useRoomStore();
    const [roomName, setRoomName] = useState("");

    const handleCreateRoom = async (event: React.FormEvent) => {
        event.preventDefault();

        const creatorID = 1; // Replace with actual creator ID logic

        try {
            const newRoom = await createRoom({ name: roomName, creatorID });
            setRoom([...rooms, newRoom]);
        } catch (error) {
            console.error("Failed to create room", error);
        }
    };

    const handleCancel = () => {
        setRoomName("");
    };

    return (
        <section className="createroom-card">
            <form onSubmit={handleCreateRoom}>
                <h1>Create Room</h1>
                <InputLine
                    type="text"
                    placeholder="Enter Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <div className="createroom-inputgroup">
                    <button type="submit">Create</button>
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </section>
    );
}
