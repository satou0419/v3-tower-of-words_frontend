"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { InputLine } from "@/app/component/Input/Input";
import Modal from "@/app/component/Modal/Modal";
import joinRoom from "@/lib/room-endpoint/joinRoom";
import "./joinroom.scss";
import Loading from "@/app/loading";

export default function JoinRoom() {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [redirectAfterClose, setRedirectAfterClose] = useState(false);
    const router = useRouter();

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true

        try {
            await joinRoom(code);
            setIsSuccessModalOpen(true);
            setRedirectAfterClose(true);
        } catch (err) {
            setIsErrorModalOpen(true);
        } finally {
            setIsLoading(false); // Reset loading state to false
        }
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
        if (redirectAfterClose) {
            router.push("/student-room");
        }
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    return (
        <main className="joinroom-wrapper">
            <Modal
                className="success-modal"
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
                title="Success!"
                details="Successfully joined the room!"
                buttons={[
                    <button key="ok" onClick={handleCloseSuccessModal}>
                        OK
                    </button>,
                ]}
            />

            <Modal
                className="error-modal"
                isOpen={isErrorModalOpen}
                onClose={handleCloseErrorModal}
                title="Error"
                details="Failed to join the room. Please check the code and try again."
                buttons={[
                    <button key="retry" onClick={handleCloseErrorModal}>
                        Retry
                    </button>,
                    <button key="cancel" onClick={handleCloseErrorModal}>
                        Cancel
                    </button>,
                ]}
            />

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
                                required
                            />
                            <button type="submit" disabled={isLoading}>
                                {isLoading ? <Loading /> : "Join now"}{" "}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                disabled={isLoading}
                            >
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
