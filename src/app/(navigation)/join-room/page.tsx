"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { InputLine } from "@/app/component/Input/Input";
import "./joinroom.scss";
import joinRoom from "@/lib/room-endpoint/joinRoom";
import Toast from "@/app/component/Toast/Toast";

export default function JoinRoom() {
    const [code, setCode] = useState("");
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "warning">(
        "success"
    );
    const router = useRouter();

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setToastMessage(null); // Clear any previous toast message

        try {
            await joinRoom(code);
            setToastMessage("Successfully joined the room!");
            setToastType("success");
            router.push("/student-room"); // Redirect to the room page or any desired page
        } catch (err) {
            setToastMessage(
                "Failed to join the room. Please check the code and try again."
            );
            setToastType("error");
        }
    };

    return (
        <main className="joinroom-wrapper">
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}
            <section className="joinroom-container">
                <section className="joinroom-card">
                    <form onSubmit={handleJoinRoom}>
                        <h1>Join Room</h1>
                        <div className="joinroom-inputgroup">
                            <InputLine
                                type="text"
                                placeholder="Enter Tower Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <button type="submit">Join now</button>
                            <button type="button" onClick={() => router.back()}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>

                <section className="joincard-banner">
                    <img
                        src="/assets/images/banner/banner-joinroom.webp"
                        alt="Join Room Banner"
                    />
                </section>
            </section>
        </main>
    );
}
