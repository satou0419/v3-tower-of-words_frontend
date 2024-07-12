// CreateGame.tsx
"use client";
import Tab from "@/app/component/Tab/Tab";
import React, { useEffect, useState } from "react";
import "./creategame.scss";
import SettingsTab from "./SettingsTab";
import WordsTab from "./WordsTab";
import useTabManagement from "@/hook/useTab";

export default function CreateGame() {
    const { activeTab, handleTabChange } = useTabManagement(
        "/create-game",
        "my-wrod"
    );
    const tabData = [
        {
            title: "Words",
            id: "my-word",
            content: <WordsTab />,
        },
        {
            title: "Setting",
            id: "setting",
            content: <SettingsTab />,
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
