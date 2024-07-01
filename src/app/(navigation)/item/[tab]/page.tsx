"use client";

import React, { useEffect, useState } from "react";
import "./item.scss";
import "./shop.scss";
import { useRouter, usePathname } from "next/navigation";
import Tab from "@/app/component/Tab/Tab";
import CardInventory from "@/app/component/Card/CardInventory/CardInventory";
import CardShop from "@/app/component/Card/CardShop/CardShop";

export default function Item() {
    const handleClick = () => {
        console.log("Click");
    };

    const router = useRouter();
    const pathname = usePathname();
    const pathSegments = pathname.split("/");

    const initialTab = pathSegments.length > 2 ? pathSegments[2] : "inventory";
    const [activeTab, setActiveTab] = useState<string>(initialTab);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    useEffect(() => {
        const currentPathSegments = pathname.split("/");
        const currentTab =
            currentPathSegments.length > 2
                ? currentPathSegments[2]
                : "inventory";
        setActiveTab(currentTab);
    }, [pathname]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/item/${tab}`);
    };

    const handleItemClick = (title: string) => {
        setSelectedItem(title);
    };

    const tabData = [
        {
            title: "Inventory",
            id: "inventory",
            content: (
                <section className="inventory_wrapper">
                    <section className="inventory-item">
                        <section className="inventory-list">
                            <CardInventory
                                className={
                                    selectedItem === "Health Kit"
                                        ? "active"
                                        : ""
                                }
                                imgSrc="#"
                                title="Health Kit"
                                description="Lorem ipsum"
                                quantity={2}
                                onClick={() => handleItemClick("Health Kit")}
                            />
                            <CardInventory
                                className={
                                    selectedItem === "Ammo Pack" ? "active" : ""
                                }
                                imgSrc="#"
                                title="Ammo Pack"
                                description="Dolor sit amet"
                                quantity={5}
                                onClick={() => handleItemClick("Ammo Pack")}
                            />
                        </section>
                    </section>
                    <section className="inventory-item_detail">
                        <section className="inventory-item_detail-container">
                            <section className="inventory-item_detail-banner">
                                <img src="#" />
                            </section>

                            <section className="inventory-item_detail-container-description">
                                <h1>{selectedItem}</h1>
                                <span>Lorem Ipsum</span>
                            </section>
                        </section>
                    </section>
                </section>
            ),
        },
        {
            title: "Shop",
            id: "shop",
            content: (
                <section className="shop-wrapper">
                    <section className="shop-container">
                        <CardShop
                            imgSrc="#"
                            title="Medkit"
                            price={300}
                            onClick={handleClick}
                        />
                    </section>
                </section>
            ),
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
