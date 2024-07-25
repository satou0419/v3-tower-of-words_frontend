"use client";
import React, { useEffect, useState } from "react";
import { InputLine } from "@/app/component/Input/Input";
import { useRouter } from "next/navigation";
import "./createroom.scss";
import { useRoomStore } from "@/store/roomStore";
import { createRoom } from "@/lib/room-endpoint/createRoom";
import { useAuthStore } from "@/store/authStore";
import useUserInfoStore from "@/store/userInfoStore";


export default function CreateRoom() {
    const { rooms, setRoom } = useRoomStore();
    const [roomName, setRoomName] = useState("");
    const { userID } = useAuthStore.getState();
    const [showPopup, setShowPopup] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { userType } = useUserInfoStore.getState();

    console.log(userID);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleCreateRoom = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!roomName.trim()) {
            setError("Room name cannot be empty");
            return;
        }

        const creatorID = userID;

        try {
            const newRoom = await createRoom({ name: roomName, creatorID });
            setRoom([...rooms, newRoom]);
            setCode(newRoom.data.code);
            console.log(newRoom);
            setShowPopup(!showPopup);
            
        } catch (error) {
            console.error("Failed to create room", error);
        }
    };

    const handleCancel = () => {
        router.push(`/${userType.toLowerCase()}-room`);
    };

    const handleBack = () => {
        setShowPopup(!showPopup);
    };

    return (
        <section className="createroom-wrapper">
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

                {error && <p className="error-message">{error}</p>}
                    {showPopup && (
                        <div className="cardroomcode-popup">
                            <div>{code}</div>
                            <div>
                                <button onClick={handleBack} >Back</button>
                            </div>
                            <div>
                                <button>Next</button>
                            </div>
                        </div>
                    )}
            </section>
        </section>
    );
}
