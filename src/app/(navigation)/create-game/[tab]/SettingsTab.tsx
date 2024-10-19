// SettingsTab.tsx
import React, { useState } from "react";
import { InputBox } from "@/app/component/Input/Input";
import Toggle from "@/app/component/Toggle/Toggle";
import createGame from "@/lib/simulation-endpoint/createGame";
import { useRouter } from "next/navigation";
import Toast from "@/app/component/Toast/Toast";
import Modal from "@/app/component/Modal/Modal";

interface Enemy {
    imagePath: string;
    words: number[];
}

interface Room {
    roomID: number;
}

interface SimulationDetails {
    roomID: Room;
    simulationType: string;
    name: string;
    deadline: string;
    attackInterval: number;
    studentLife: number;
    items: boolean;
    description: boolean;
    pronunciation: boolean;
    enemy: Enemy[];
}

interface SettingsTabProps {
    settings?: SimulationDetails | null;
    updateSettings: (updatedSettings: Partial<SimulationDetails>) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
    settings,
    updateSettings,
}) => {
    const router = useRouter();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "warning">(
        "success"
    );
    const [showPopup, setShowPopup] = useState(false);
    let isCreatingGame = false;

    const handleToggle =
        (field: keyof SimulationDetails) => (state: boolean) => {
            updateSettings({ [field]: state });
        };

    const handleChange =
        (field: keyof SimulationDetails) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const value =
                event.target.type === "checkbox"
                    ? (event.target as HTMLInputElement).checked
                    : event.target.value;
            updateSettings({ [field]: value });
        };

    const handleCloseModal = () => {
        setShowPopup(false);
    };

    const handleCreateGame = () => {
        if (!settings?.name) {
            setToastMessage("Simulation name is required.");
            setToastType("warning");
            return;
        }

        if (!settings?.deadline) {
            setToastMessage("Deadline is required.");
            setToastType("warning");
            return;
        }

        const deadlineDate = new Date(settings.deadline);
        if (isNaN(deadlineDate.getTime())) {
            setToastMessage("Deadline must be a valid date.");
            setToastType("warning");
            return;
        }

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (deadlineDate < currentDate) {
            setToastMessage("Deadline cannot be in the past.");
            setToastType("warning");
            return;
        }

        if (
            settings.attackInterval === 0 ||
            settings.attackInterval === undefined
        ) {
            setToastMessage("Attack Interval must be a valid option.");
            setToastType("warning");
            return;
        }

        if (settings.studentLife === 0 || settings.studentLife === undefined) {
            setToastMessage("Student Life must be between 1 and 8..");
            setToastType("warning");
            return;
        }

        if (!settings.enemy || settings.enemy.length === 0) {
            setToastMessage("At least one enemy must be defined.");
            setToastType("warning");
            return;
        }

        const invalidEnemies = settings.enemy.filter(
            (enemy) => !enemy.imagePath || enemy.imagePath.trim() === ""
        );

        if (invalidEnemies.length > 0) {
            setToastMessage("Please Select an Enemy!");
            setToastType("warning");
            return;
        }

        for (const enemy of settings.enemy) {
            if (!enemy.words || enemy.words.length === 0) {
                setToastMessage("Each enemy must have at least one word.");
                setToastType("warning");
                return;
            }
        }

        setShowPopup(true);
    };

    const handleConfirmCreateGame = async () => {
        if (!settings) {
            setToastMessage("Settings are not set.");
            setToastType("error");
            return;
        }

        if (isCreatingGame) return;

        isCreatingGame = true;

        try {
            await createGame(settings);
            router.push(`/teacher-room/game?roomID=${settings.roomID.roomID}`);
            localStorage.removeItem("enemies");
            localStorage.removeItem("settings");
            setShowPopup(false);
        } catch (error) {
            setToastMessage("Error creating game.");
            setToastType("error");
            console.error(error);
        } finally {
            isCreatingGame = false;
        }
    };

    console.log(settings);

    return (
        <main className="setting-wrapper">
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}
            <section className="setting">
                <InputBox
                    type="text"
                    placeholder="Enter Simulation Name"
                    value={settings?.name}
                    onChange={handleChange("name")}
                />
                <InputBox
                    type="datetime-local"
                    value={settings?.deadline}
                    onChange={handleChange("deadline")}
                />
                <select
                    value={settings?.attackInterval}
                    onChange={handleChange("attackInterval")}
                >
                    <option value={0}>Attack Interval</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={25}>25</option>
                    <option value={30}>30</option>
                    <option value={35}>35</option>
                    <option value={40}>40</option>
                    <option value={45}>45</option>
                    <option value={50}>50</option>
                    <option value={55}>55</option>
                    <option value={60}>60</option>
                </select>
                <select
                    value={settings?.studentLife}
                    onChange={handleChange("studentLife")}
                >
                    <option value={0}>Student Life</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                </select>
                <Toggle
                    className="toggle"
                    label="Items"
                    isEnabled={settings?.items}
                    onToggle={handleToggle("items")}
                />
                <Toggle
                    className="toggle"
                    label="Description"
                    isEnabled={settings?.description}
                    onToggle={handleToggle("description")}
                />
                <Toggle
                    className="toggle"
                    label="Pronunciation"
                    isEnabled={settings?.pronunciation}
                    onToggle={handleToggle("pronunciation")}
                />
                <button onClick={handleCreateGame}> Create Game </button>
            </section>
            {showPopup && (
                <Modal
                    className="confirmation-modal"
                    title="Confirm Create Game?"
                    isOpen={showPopup}
                    onClose={handleCloseModal}
                    buttons={[
                        <button key="confirm" onClick={handleConfirmCreateGame}>
                            Yes
                        </button>,
                        <button key="No" onClick={handleCloseModal}>
                            Cancel
                        </button>,
                    ]}
                />
            )}
        </main>
    );
};

export default SettingsTab;
