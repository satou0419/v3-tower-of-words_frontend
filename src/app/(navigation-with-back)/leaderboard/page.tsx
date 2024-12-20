"use client";
import React, { useEffect, useState } from "react";
import CardTab from "@/app/component/Card/CardTab/CardTab";
import "./leaderboard.scss";
import CardSetting from "@/app/component/Card/CardSetting/CardSetting";
import CardUser from "@/app/component/Card/CardUser/CardUser";
import { useSimulationStore } from "@/store/simulationStore";
import { useRouter, useSearchParams } from "next/navigation";
import { viewSimulation } from "@/lib/simulation-endpoint/viewSimulation";
import cloneGame from "@/lib/simulation-endpoint/cloneGame";
import Toast from "@/app/component/Toast/Toast";
import { useRoomStore } from "@/store/roomStore";
import useUserInfoStore from "@/store/userInfoStore";
import editSimulation from "@/lib/simulation-endpoint/editSimulation";
import Modal from "@/app/component/Modal/Modal";
import deleteSimulation from "@/lib/simulation-endpoint/deleteSimulation";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import getStudentInfo from "@/lib/user-endpoint/getStudentInfo";

export default function Leaderboard() {
    const { currentRoom } = useRoomStore();
    const { userType } = useUserInfoStore.getState();
    const { currentSimulation, setCurrentSimulation } = useSimulationStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "warning">(
        "success"
    );
    const [showPopup, setShowPopup] = useState(false);
    const [newName, setNewName] = useState<string>(currentSimulation.name);
    const [newDeadline, setNewDeadline] = useState<string>(
        currentSimulation.deadline
    );
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const simulationIDParam = searchParams.get("simulationID");
    const simulationID = simulationIDParam
        ? parseInt(simulationIDParam, 10)
        : NaN;

    useEffect(() => {
        const fetchSimulations = async () => {
            try {
                const simulation = await viewSimulation(simulationID);
                setCurrentSimulation(simulation);
                console.log("hEKKI", simulation);
            } catch (error) {
                console.error(
                    "Failed to fetch simulations for the room:",
                    error
                );
            }
        };
        fetchSimulations();
    }, [setCurrentSimulation]);

    const handleDownloadExcel = async () => {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("Leaderboard");

        worksheet.columns = [
            { header: "Rank", key: "rank", width: 10 },
            { header: "Username", key: "username", width: 30 },
            { header: "First Name", key: "firstname", width: 30 },
            { header: "Last Name", key: "lastname", width: 30 },
            { header: "Score", key: "score", width: 10 },
            { header: "Accuracy", key: "accuracy", width: 10 },
            { header: "Duration", key: "duration", width: 15 },
            { header: "Mistakes", key: "mistakes", width: 10 },
        ];

        const sortedParticipants = currentSimulation.participants.sort((a, b) =>
            b.score === a.score ? b.accuracy - a.accuracy : b.score - a.score
        );

        console.log(sortedParticipants);

        const rows = await Promise.all(
            sortedParticipants.map(async (participant, index) => {
                const user = await getStudentInfo(participant.userID);
                console.log(user);

                console.log(participant);

                return {
                    rank: index + 1,
                    username: user ? user.username : "Unknown",
                    firstname: user ? user.firstname : "N/A",
                    lastname: user ? user.lastname : "N/A",
                    score: participant.score,
                    accuracy: participant.accuracy,
                    duration: participant.done
                        ? participant.duration
                        : "No Attempt",
                    mistakes: participant.mistakes,
                };
            })
        );

        // Add all rows to the worksheet
        worksheet.addRows(rows);

        // Generate Excel file and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `Leaderboard_Simulation_${currentSimulation.name}.xlsx`);
    };

    const handleDelete = async () => {
        console.log("Delete button clicked");

        try {
            const response = await deleteSimulation(simulationID);
            console.log("Simulation deleted successfully:", response);
            router.push(`/${userType.toLowerCase()}-room`);
        } catch (error) {
            console.error("Failed to delete simulation:", error);
        } finally {
            setShowDeletePopup(false); // Close the delete confirmation modal
        }
    };

    const handleClone = async (simulation: any) => {
        try {
            if (currentRoom.roomID == 0 && userType) {
                setToastMessage("Error cloning simulation");
                setToastType("error");
                router.push(`/${userType.toLowerCase()}-room`);
                return;
            }
            await cloneGame(simulationID, currentRoom.roomID);
            setToastMessage("Simulation cloned successfully");
            setToastType("success");
        } catch (error) {
            setToastMessage("Error cloning simulation");
            setToastType("error");
        } finally {
            setShowPopup(false);
        }
    };

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!newName && !newDeadline) {
            setToastMessage("Input cannot be empty");
            setToastType("warning");
            return;
        }

        if (!newName) {
            try {
                await editSimulation({
                    simulationID,
                    name: currentSimulation.name,
                    deadline: newDeadline,
                });
                setToastMessage("Simulation updated successfully");
                setToastType("success");
            } catch (error) {
                setToastMessage("Error updating simulation");
                setToastType("error");
            }
        }

        if (!newDeadline) {
            try {
                await editSimulation({
                    simulationID,
                    name: newName,
                    deadline: currentSimulation.deadline,
                });
                setToastMessage("Simulation updated successfully");
                setToastType("success");
            } catch (error) {
                setToastMessage("Error updating simulation");
                setToastType("error");
            }
        }

        if (newDeadline && newName) {
            try {
                await editSimulation({
                    simulationID,
                    name: newName,
                    deadline: newDeadline,
                });
                setToastMessage("Simulation updated successfully");
                setToastType("success");
            } catch (error) {
                setToastMessage("Error updating simulation");
                setToastType("error");
            }
        }
    };

    const handleViewWordClick = () => {
        router.push(`/teacher-simulation-words?simulationID=${simulationID}`);
    };

    const handleGameAssessment = () => {
        router.push(`/game-assessment?simulationID=${simulationID}`);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(event.target.value);
    };

    const handleDeadlineChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewDeadline(event.target.value);
    };

    const handleStudentClick = (studentID: number) => {
        router.push(
            `/student-assessment?simulationID=${simulationID}&studentID=${studentID}`
        );
    };

    const handleCloseModal = () => {
        setShowPopup(false);
    };

    const handleCloseDeleteModal = () => {
        setShowDeletePopup(false);
    };

    const inputSetting = [
        {
            type: "text",
            placeholder: "Update Simulation Name",
            value: newName,
            onChange: handleNameChange,
        },
        {
            type: "datetime-local",
            placeholder: "Update Time",
            value: newDeadline,
            onChange: handleDeadlineChange,
        },
    ];

    return (
        <main className="leaderboard-wrapper">
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}
            <section className="leaderboard-container">
                <h1>
                    Simulation ID: {simulationID} | Simulation Name:{" "}
                    {currentSimulation.name}
                </h1>

                <section className="leaderboard-content">
                    <CardTab
                        className="leaderboard-card"
                        title="Leaderboard"
                        subtitle="Student Total: "
                        counter={currentSimulation.participants.length.toString()}
                    >
                        {currentSimulation.participants
                            .sort((a, b) => {
                                if (b.score === a.score) {
                                    return b.accuracy - a.accuracy; // Sort by accuracy if scores are tied
                                }
                                return b.score - a.score; // Sort by score
                            })
                            .map((participant, index) => (
                                <CardUser
                                    key={index}
                                    index={index}
                                    username={participant.userID}
                                    time={
                                        participant.done
                                            ? participant.duration
                                            : "No Attempt!"
                                    }
                                    score={participant.score}
                                    className="custom-carduser"
                                    onClick={() =>
                                        handleStudentClick(participant.userID)
                                    }
                                />
                            ))}
                    </CardTab>

                    <section className="leaderboard-setting">
                        <section className="button-group">
                            <button type="button" onClick={handleViewWordClick}>
                                View Words
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPopup(true)}
                            >
                                Create a Copy
                            </button>
                            <button
                                type="button"
                                onClick={handleGameAssessment}
                            >
                                Game Assessment
                            </button>
                        </section>

                        <section className="uneditable-settings">
                            <section className="uneditable-settings-top">
                                <div className="setting-item">
                                    <span>Attack Interval: </span>
                                    <span>
                                        {currentSimulation.attackInterval}
                                    </span>
                                </div>
                                <div className="setting-item">
                                    <span>Student Life: </span>
                                    <span>{currentSimulation.studentLife}</span>
                                </div>
                                <div className="setting-item">
                                    <span>Items: </span>
                                    <input
                                        type="checkbox"
                                        checked={currentSimulation.items}
                                        readOnly
                                    />
                                </div>
                                <div className="setting-item">
                                    <span>Description: </span>
                                    <input
                                        type="checkbox"
                                        checked={currentSimulation.description}
                                        readOnly
                                    />
                                </div>
                                <div className="setting-item">
                                    <span>Pronunciation: </span>
                                    <input
                                        type="checkbox"
                                        checked={
                                            currentSimulation.pronunciation
                                        }
                                        readOnly
                                    />
                                </div>
                            </section>
                            <section className="uneditable-settings-top">
                                <button
                                    type="button"
                                    onClick={handleDownloadExcel}
                                >
                                    Download Excel
                                </button>
                            </section>
                        </section>
                        <CardSetting
                            title="Settings"
                            inputs={inputSetting}
                            deleteButtonLabel="Delete Simulation"
                            saveButtonLabel="Save"
                            onDelete={() => setShowDeletePopup(true)}
                            onSave={handleSave}
                            className="custom-cardsetting"
                        />
                    </section>
                </section>
            </section>
            {showPopup && (
                <Modal
                    className="confirmation-modal"
                    title="Confirm Clone Simulation?"
                    isOpen={showPopup}
                    onClose={handleCloseModal}
                    buttons={[
                        <button key="No" onClick={handleCloseModal}>
                            Cancel
                        </button>,
                        <button key="confirm" onClick={handleClone}>
                            Yes
                        </button>,
                    ]}
                />
            )}
            {showDeletePopup && (
                <Modal
                    className="confirmation-modal"
                    title="Confirm Delete Simulation?"
                    isOpen={showDeletePopup}
                    onClose={handleCloseDeleteModal}
                    buttons={[
                        <button key="No" onClick={handleCloseDeleteModal}>
                            Cancel
                        </button>,
                        <button key="confirm" onClick={handleDelete}>
                            Yes
                        </button>,
                    ]}
                />
            )}
        </main>
    );
}
