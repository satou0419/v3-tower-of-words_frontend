"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { InputLine } from "@/app/component/Input/Input";
import Modal from "@/app/component/Modal/Modal";
import joinRoom from "@/lib/room-endpoint/joinRoom";
import "./joinroom.scss";

export default function JoinRoom() {
    const [code, setCode] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [redirectAfterClose, setRedirectAfterClose] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            await joinRoom(code);
            setIsSuccessModalOpen(true); // Open success modal
            setRedirectAfterClose(true); // Set redirect flag
        } catch (err) {
            setIsErrorModalOpen(true); // Open error modal
        } finally {
            setLoading(false); // Set loading back to false after request completes
        }
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
        if (redirectAfterClose) {
            router.push("/student-room"); // Redirect to the room page or any desired page
        }
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    return (
        <main className="joinroom-wrapper">
            {/* Success Modal */}
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

            {/* Error Modal */}
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
