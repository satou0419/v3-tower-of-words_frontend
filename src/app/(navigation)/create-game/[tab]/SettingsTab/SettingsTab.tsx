// SettingsTab.tsx
import React, { useState, useEffect } from "react";
import { InputBox } from "@/app/component/Input/Input";
import Toggle from "@/app/component/Toggle/Toggle";
import createGame from "@/lib/simulation-endpoint/createGame";

interface Enemy {
    id: number;
    imagePath: string;
    words: SimulationWords[];
}

interface SimulationWords {
    word: string;
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
    numberOfAttempt: number;
    items: boolean;
    description: boolean;
    pronunciation: boolean;
    enemy: Enemy[];
}

interface SettingsTabProps {
    settings: SimulationDetails;
    updateSettings: (updatedSettings: Partial<SimulationDetails>) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ settings, updateSettings }) => {
    const [isEnabled, setIsEnabled] = useState(false);

    const handleToggle = (field: keyof SimulationDetails) => (state: boolean) => {
        updateSettings({ [field]: state });
    };

    useEffect(() => {
        if (settings) {
            setIsEnabled(settings.items);
        }
    }, [settings]);

    const handleChange = (field: keyof SimulationDetails) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value;
        updateSettings({ [field]: value });
    };

    const handleCreateGame = () => {
        console.log("Creating game with settings:", settings);
        createGame(settings);
        localStorage.removeItem("enemies");
        localStorage.removeItem("settings");
    }
    console.log(settings)

    return (
        <main className="setting-wrapper">
            <section className="setting">
                <InputBox
                    type="text"
                    placeholder="Enter Simulation Name"
                    value={settings.name}
                    onChange={handleChange('name')}
                />
                <InputBox
                    type="datetime-local"
                    value={settings.deadline}
                    onChange={handleChange('deadline')}
                />
                <select
                    value={settings.attackInterval}
                    onChange={handleChange('attackInterval')}
                >
                    <option className="select-display">Attack Interval</option>
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
                    onChange={handleChange('studentLife')}
                >
                    <option className="select-display">Student Life</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                </select>
                <select
                    value={settings.numberOfAttempt}
                    onChange={handleChange('numberOfAttempt')}
                >
                    <option className="select-display">Number of Attempts</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
                <Toggle
                    className="toggle"
                    label="Items"
                    isEnabled={settings.items}
                    onToggle={handleToggle('items')}
                />
                <Toggle
                    className="toggle"
                    label="Description"
                    isEnabled={settings.description}
                    onToggle={handleToggle('description')}
                />
                <Toggle
                    className="toggle"
                    label="Pronunciation"
                    isEnabled={settings.pronunciation}
                    onToggle={handleToggle('pronunciation')}
                />
                <select>
                    <option className="select-display">Number of Attempts</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
                <button onClick={handleCreateGame}> bots </button>
            </section>
        </main>
    );
};

export default SettingsTab;
