// Item.tsx
"use client";

import React, { useEffect, useState } from "react";
import "./item.scss";
import "./shop.scss";
import Tab from "@/app/component/Tab/Tab";
import InventoryTab from "./InventoryTab";
import ShopTab from "./ShopTab";
import useTabManagement from "@/hook/useTab";
import Loading from "@/app/loading"; // Import the Loading component

export default function Item() {
    const { activeTab, handleTabChange } = useTabManagement(
        "/item",
        "inventory"
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
            title: "Inventory",
            id: "inventory",
            content: <InventoryTab />,
        },
        {
            title: "Shop",
            id: "shop",
            content: <ShopTab />,
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
