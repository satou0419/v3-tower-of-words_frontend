"use client";

import React, { useEffect, useState } from "react";
import "./item.scss";
import "./shop.scss";
import { useRouter, usePathname } from "next/navigation";
import Tab from "@/app/component/Tab/Tab";
import CardInventory from "@/app/component/Card/CardInventory/CardInventory";
import CardShop from "@/app/component/Card/CardShop/CardShop";
import { useItemStore } from "@/store/itemStore";
import getAllItems from "@/lib/item-endpoint/getAllItem";

interface Item {
    itemID: number;
    itemName: string;
    imagePath: string;
    itemDescription: string;
    itemPrice: number;
    quantity: number;
}

export default function Item() {
    const handleClick = () => {
        console.log("Click");
    };

    const { items, setItems } = useItemStore();

    useEffect(() => {
        getAllItems().then((fetchedItems) => {
            // Sort items so those with quantity 0 are at the bottom
            const sortedItems = fetchedItems.sort((a: Item, b: Item) => {
                if (a.quantity === 0 && b.quantity !== 0) return 1;
                if (a.quantity !== 0 && b.quantity === 0) return -1;
                return 0;
            });
            setItems(sortedItems);
        });
    }, [setItems]);

    const router = useRouter();
    const pathname = usePathname();
    const pathSegments = pathname.split("/");

    const initialTab = pathSegments.length > 2 ? pathSegments[2] : "inventory";
    const [activeTab, setActiveTab] = useState<string>(initialTab);
    const [selectedItem, setSelectedItem] = useState<{
        name: string | null;
        description: string | null;
        banner: string | null;
    }>({
        name: null,
        description: null,
        banner: null,
    });

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

    const handleItemClick = (item: Item) => {
        setSelectedItem({
            name: item.itemName,
            description: item.itemDescription,
            banner: `/assets/images/reward/${item.imagePath}`,
        });
    };

    const tabData = [
        {
            title: "Inventory",
            id: "inventory",
            content: (
                <section className="inventory_wrapper">
                    <section className="inventory-item">
                        <section className="inventory-list">
                            {items.map((item) => (
                                <CardInventory
                                    key={item.itemID}
                                    className={`${
                                        selectedItem.name === item.itemName
                                            ? "active"
                                            : ""
                                    } ${
                                        item.quantity === 0 ? "grayscale" : ""
                                    }`}
                                    imgSrc={`/assets/images/reward/${item.imagePath}`}
                                    title={item.itemName}
                                    description={item.itemDescription}
                                    quantity={item.quantity}
                                    onClick={() => handleItemClick(item)}
                                />
                            ))}
                        </section>
                    </section>
                    <section className="inventory-item_detail">
                        <section className="inventory-item_detail-container">
                            <section className="inventory-item_detail-banner">
                                {selectedItem.banner && (
                                    <img
                                        src={selectedItem.banner}
                                        alt={selectedItem.name || ""}
                                    />
                                )}
                            </section>

                            <section className="inventory-item_detail-container-description">
                                <h1>{selectedItem.name}</h1>
                                <span>{selectedItem.description}</span>
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
                        {items.map((item) => (
                            <CardShop
                                key={item.itemID}
                                imgSrc={`/assets/images/reward/${item.imagePath}`}
                                title={item.itemName}
                                price={item.itemPrice}
                                onClick={handleClick}
                            />
                        ))}
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
