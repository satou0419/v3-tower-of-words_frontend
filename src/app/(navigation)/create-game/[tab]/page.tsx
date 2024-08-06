// CreateGame.tsx
"use client";
import Tab from "@/app/component/Tab/Tab";
import React, { useEffect, useState } from "react";
import "./creategame.scss";
import SettingsTab from "./SettingsTab/SettingsTab";
import WordsTab from "./WordsTab/WordsTab";
import useTabManagement from "@/hook/useTab";

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

export default function CreateGame() {
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [room, setRoom] = useState<Room>({roomID: 1});
    const [settings, setSettings] = useState<SimulationDetails>(() => {
        const savedSettings = localStorage.getItem("settings");
        return savedSettings
            ? JSON.parse(savedSettings)
            : {
                roomID: { roomID: 1 },
                simulationType: "Spelling",
                name: "",
                deadline: "",
                attackInterval: 20,
                studentLife: 6,
                numberOfAttempt: 1,
                items: true,
                description: true,
                pronunciation: true,
                enemy: [],
            };
    });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const storedEnemies = localStorage.getItem("enemies");
        if (storedEnemies) {
            setEnemies(JSON.parse(storedEnemies));
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem("enemies", JSON.stringify(enemies));
        }
    }, [enemies, isClient]);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem("settings", JSON.stringify(settings));
        }
    }, [settings, isClient]);

    useEffect(() => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            roomID: room,
            enemy: enemies,
        }));
    }, [room, enemies]);

    const { activeTab, handleTabChange } = useTabManagement(
        "/create-game",
        "my-word"
    );

    const addEnemy = () => {
        const newEnemy: Enemy = {
            id: enemies.length > 0 ? enemies[enemies.length - 1].id + 1 : 1,
            imagePath:"dafuq",
            words:[]
        };

        setEnemies([...enemies, newEnemy]);
    };

    const removeEnemy = (id: number) => {
        setEnemies(enemies.filter((enemy) => enemy.id !== id));
    };

    const updateSettings = (updatedSettings: Partial<SimulationDetails>) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            ...updatedSettings,
        }));
    };

    console.log(enemies)

    const tabData = [
        {
            title: "Words",
            id: "my-word",
            content: <WordsTab enemies={enemies} addEnemy={addEnemy} removeEnemy={removeEnemy} />,
        },
        {
            title: "Setting",
            id: "setting",
            content: <SettingsTab settings={settings} updateSettings={updateSettings} />,
        },
    ];

    return (
        <main className="creategame-wrapper">
            <Tab
                tabs={tabData}
                currentTab={activeTab}
                onTabChange={handleTabChange}
            />
        </main>
    );
}
