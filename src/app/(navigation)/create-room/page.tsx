"use client";
import React, { useEffect, useState } from "react";
import { InputLine } from "@/app/component/Input/Input";
import { useRouter } from "next/navigation";
import { useRoomStore } from "@/store/roomStore";
import { createRoom } from "@/lib/room-endpoint/createRoom";
import { useAuthStore } from "@/store/authStore";
import useUserInfoStore from "@/store/userInfoStore";
import Toast from "@/app/component/Toast/Toast";
import Modal from "@/app/component/Modal/Modal";
import "./createroom.scss";

export default function CreateRoom() {
    const { rooms, setRoom } = useRoomStore();
    const [roomName, setRoomName] = useState("");
    const { userID } = useAuthStore.getState();
    const [showPopup, setShowPopup] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [isCopied, setIsCopied] = useState(false); // New state for copy status
    const router = useRouter();
    const { userType } = useUserInfoStore.getState();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "warning">(
        "success"
    );

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false); // Reset the copy status after a short delay
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isCopied]);

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
            setShowPopup(true); // Open the modal when room is created
        } catch (error) {
            setToastMessage("Failed to create room!");
            setToastType("error");
        }
    };

    const handleCloseModal = () => {
        setShowPopup(false);
        router.push(`/${userType.toLowerCase()}-room`);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(code).then(
            () => {
                setIsCopied(true); // Set the copy status to true
                setToastMessage("Room code copied to clipboard!");
                setToastType("success");
            },
            () => {
                setToastMessage("Failed to copy room code!");
                setToastType("error");
            }
        );
    };

    const handleCancel = () => {
        router.push(`/${userType.toLowerCase()}-room`);
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
            {/* Room Code Modal */}
            {showPopup && (
                <Modal
                    className="room-code-modal"
                    title="Room Code"
                    details={`The room code is ${code}.`}
                    isOpen={showPopup}
                    onClose={handleCloseModal}
                    buttons={[
                        <button
                            key="copy"
                            onClick={handleCopyToClipboard}
                            className={isCopied ? "copied" : ""} // Apply dynamic class
                        >
                            {isCopied ? "Copied!" : "Copy"}
                        </button>,
                        <button key="ok" onClick={handleCloseModal}>
                            OK
                        </button>,
                    ]}
                />
            )}
        </section>
    );
}
