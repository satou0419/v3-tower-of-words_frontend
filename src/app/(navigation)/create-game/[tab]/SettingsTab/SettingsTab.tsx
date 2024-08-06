// SettingsTab.tsx
import React, { useState, useEffect } from "react";
import { InputBox } from "@/app/component/Input/Input";
import Toggle from "@/app/component/Toggle/Toggle";
import createGame from "@/lib/simulation-endpoint/createGame";
import { useRouter } from "next/navigation";

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
    // numberOfAttempt: number;
    items: boolean;
    description: boolean;
    pronunciation: boolean;
    enemy: Enemy[];
}

interface SettingsTabProps {
    settings: SimulationDetails;
    updateSettings: (updatedSettings: Partial<SimulationDetails>) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
    settings,
    updateSettings,
}) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const router = useRouter();

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

    const validateSettings = (settings: SimulationDetails) => {
        const errors: string[] = [];

        if (!settings.name.trim()) {
            errors.push("Simulation name is required.");
        }

        if (!settings.deadline) {
            errors.push("Deadline is required.");
        } else {
            const deadlineDate = new Date(settings.deadline);
            if (isNaN(deadlineDate.getTime())) {
                errors.push("Deadline must be a valid date.");
            }
        }

        const validIntervals = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
        if (!validIntervals.includes(settings.attackInterval)) {
            errors.push("Attack Interval must be a valid option.");
        }

        if (settings.studentLife < 1 || settings.studentLife > 8) {
            errors.push("Student Life must be between 1 and 8.");
        }

        return errors;
    };

    const handleCreateGame = () => {
        if (!settings.name) {
            alert("Simulation name is required.");
            return;
        }

        if (!settings.deadline) {
            alert("Deadline is required.");
            return;
        }

        const deadlineDate = new Date(settings.deadline);
        if (isNaN(deadlineDate.getTime())) {
            alert("Deadline must be a valid date.");
            return;
        }

        if(settings.attackInterval == 0){
            alert("Select Attack Interval");
            return;
        }

        if(settings.studentLife == 0){
            alert("Select Student Life");
            return;
        }

        const confirmation = window.confirm("Are you sure you want to create this game?");
        if (confirmation) {
            console.log("Creating game with settings:", settings);
            createGame(settings);
            router.push(`/teacher-room/game?roomID=${settings.roomID.roomID}`);
            localStorage.removeItem("enemies");
            localStorage.removeItem("settings");
        }
    };
    console.log(settings);

    return (
        <main className="setting-wrapper">
            <section className="setting">
                <InputBox
                    type="text"
                    placeholder="Enter Simulation Name"
                    value={settings.name}
                    onChange={handleChange("name")}
                />
                <InputBox
                    type="datetime-local"
                    value={settings.deadline}
                    onChange={handleChange("deadline")}
                />
                <select
                    value={settings.attackInterval}
                    onChange={handleChange("attackInterval")}
                >
                    <option className="select-display" value="">
                        Attack Interval
                    </option>
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
                    value={settings.studentLife}
                    onChange={handleChange("studentLife")}
                >
                    <option className="select-display" value="">
                        Student Life
                    </option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                </select>
                {/* <select
                    value={settings.numberOfAttempt}
                    onChange={handleChange("numberOfAttempt")}
                >
                    <option className="select-display" disabled value="">
                        Number of Attempts
                    </option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select> */}
                <Toggle
                    className="toggle"
                    label="Items"
                    isEnabled={settings.items}
                    onToggle={handleToggle("items")}
                />
                <Toggle
                    className="toggle"
                    label="Description"
                    isEnabled={settings.description}
                    onToggle={handleToggle("description")}
                />
                <Toggle
                    className="toggle"
                    label="Pronunciation"
                    isEnabled={settings.pronunciation}
                    onToggle={handleToggle("pronunciation")}
                />
                <button onClick={handleCreateGame}> Create Game </button>
            </section>
        </main>
    );
};

export default SettingsTab;
