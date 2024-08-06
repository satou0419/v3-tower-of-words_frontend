// Item.tsx
"use client";

import React, { useEffect } from "react";
import "./item.scss";
import "./shop.scss";
import Tab from "@/app/component/Tab/Tab";
import InventoryTab from "./InventoryTab/InventoryTab";
import ShopTab from "./ShopTab/ShopTab";
import useTabManagement from "@/hook/useTab";

export default function Item() {
    const { activeTab, handleTabChange } = useTabManagement(
        "/item",
        "inventory"
    );
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
