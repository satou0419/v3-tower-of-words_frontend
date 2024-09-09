// Item.tsx
"use client";

import React, { useEffect, useState } from "react";
import "./items.scss";
import "./characters.scss";
import Tab from "@/app/component/Tab/Tab";
import ItemsTab from "./ItemsTab";
import CharactersTab from "./CharactersTab";
import useTabManagement from "@/hook/useTab";
import Loading from "@/app/loading"; // Import the Loading component

export default function Inventory() {
    const { activeTab, handleTabChange } = useTabManagement(
        "/inventory",
        "items"
    );
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Simulate an async operation (e.g., fetching data or loading components)
        const loadData = async () => {
            try {
                // Perform necessary operations here
                // e.g., fetching data, setting up state, etc.
            } catch (error) {
                console.error("Failed to load data:", error);
            } finally {
                setLoading(false); // Set loading to false after operations are completed
            }
        };

        loadData();
    }, []);

    const tabData = [
        {
            title: "Items",
            id: "items",
            content: <ItemsTab />,
        },
        {
            title: "Characters",
            id: "characters",
            content: <CharactersTab />,
        },
    ];

    if (loading) {
        return <Loading />; // Render Loading component while data is being loaded
    }

    return (
        <main className="item-wrapper">
            <Tab
                tabs={tabData}
                currentTab={activeTab}
                onTabChange={handleTabChange}
            />
        </main>
    );
}
