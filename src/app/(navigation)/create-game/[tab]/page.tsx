// CreateGame.tsx
"use client";
import Tab from "@/app/component/Tab/Tab";
import React, { useEffect, useState } from "react";
import "./creategame.scss";
import SettingsTab from "./SettingsTab";
import WordsTab from "./WordsTab";
import useTabManagement from "@/hook/useTab";
import { useRoomStore } from "@/store/roomStore";

interface Enemy {
    imagePath: string;
    words: number[];
}

interface SimulationWords {
    //simulationWordsID: number;
    creatorID: number;
    word: string;
    silentIndex: string;
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
    const { currentRoom } = useRoomStore();
    const [room, setRoom] = useState<Room>({ roomID: currentRoom.roomID });
    const [settings, setSettings] = useState<SimulationDetails>({
        roomID: { roomID: currentRoom.roomID },
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
    });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== "undefined") {
            const savedSettings = localStorage.getItem("settings");
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }

            const storedEnemies = localStorage.getItem("enemies");
            if (storedEnemies) {
                setEnemies(JSON.parse(storedEnemies));
            }
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
        if (isClient) {
            setSettings((prevSettings) => ({
                ...prevSettings,
                roomID: room,
                enemy: enemies,
            }));
        }
    }, [room, enemies]);

    const { activeTab, handleTabChange } = useTabManagement(
        "/create-game",
        "my-word"
    );

    const addEnemy = () => {
        const newEnemy: Enemy = {
            imagePath: "",
            words: [],
        };

        setEnemies([...enemies, newEnemy]);
    };

    const updateEnemyWords = (id: number, updatedWords: number[]) => {
        setEnemies(
            enemies.map((enemy, index) =>
                index === id ? { ...enemy, words: updatedWords } : enemy
            )
        );
    };

    const updateEnemyImagePath = (id: number, imagePath: string) => {
        setEnemies((prevEnemies) =>
            prevEnemies.map((enemy, index) =>
                index === id ? { ...enemy, imagePath } : enemy
            )
        );
    };

    const removeEnemy = (id: number) => {
        setEnemies(enemies.filter((enemy, index) => index !== id));
    };

    const updateSettings = (updatedSettings: Partial<SimulationDetails>) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            ...updatedSettings,
        }));
    };

    const tabData = [
        {
            title: "Words",
            id: "my-word",
            content: (
                <WordsTab
                    enemies={enemies}
                    addEnemy={addEnemy}
                    removeEnemy={removeEnemy}
                    updateEnemyWords={updateEnemyWords}
                    updateEnemyImagePath={updateEnemyImagePath}
                />
            ),
        },
        {
            title: "Setting",
            id: "setting",
            content: (
                <SettingsTab
                    settings={settings}
                    updateSettings={updateSettings}
                />
            ),
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
