"use client";
import React, { useEffect, useState } from "react";
import { InputLine } from "@/app/component/Input/Input";
import { useRouter } from "next/navigation";
import "./createroom.scss";
import { useRoomStore } from "@/store/roomStore";
import { createRoom } from "@/lib/room-endpoint/createRoom";
import { useAuthStore } from "@/store/authStore";
import useUserInfoStore from "@/store/userInfoStore";
import Toast from "@/app/component/Toast/Toast";

export default function CreateRoom() {
    const { rooms, setRoom } = useRoomStore();
    const [roomName, setRoomName] = useState("");
    const { userID } = useAuthStore.getState();
    const [showPopup, setShowPopup] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { userType } = useUserInfoStore.getState();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "warning">(
        "success"
    );

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
            setToastMessage("Room name cannot be empty");
            setToastType("warning");
            return;
        }

        const creatorID = userID;

        try {
            const newRoom = await createRoom({ name: roomName, creatorID });
            setRoom([...rooms, newRoom]);
            setCode(newRoom.data.code);
            setToastMessage("Room Created!");
            setToastType("success");
            setShowPopup(!showPopup);
            
        } catch (error) {
            setToastMessage("Failed to create room!");
            setToastType("error");
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
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}
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
            {showPopup && (
                <div className="cardroomcode-popup-container">
                    <button onClick={handleBack}>X</button>
                    <div className="cardroomcode-popup">
                        <h1>C O D E</h1>
                        <div>{code}</div>
                    </div>
                </div>
            )}
        </section>
    );
}
