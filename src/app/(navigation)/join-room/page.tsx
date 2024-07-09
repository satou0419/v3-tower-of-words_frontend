"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { InputLine } from "@/app/component/Input/Input";
import "./joinroom.scss";
import joinRoom from "@/lib/room-endpoint/joinRoom";

export default function JoinRoom() {
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear any previous error

        try {
            await joinRoom(code);
            alert("Successfully joined the room!");
            router.push("/student-room"); // Redirect to the room page or any desired page
        } catch (err) {
            setError(
                "Failed to join the room. Please check the code and try again."
            );
        }
    };

    return (
        <main className="joinroom-wrapper">
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
                            {error && <p className="error">{error}</p>}
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
