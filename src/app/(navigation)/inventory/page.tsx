"use client";
import getAllItems from "@/lib/item-endpoint/getAllItem";
import { useItemStore } from "@/store/itemStore";
import Link from "next/link";
import { useEffect } from "react";

export default function Inventory() {
    const { items } = useItemStore();

    return (
        <main className="inventory-wrapper">
            {items.map((item) => (
                <section key={item.itemID} className="inventory-card">
                    <span></span>
                    <span className="inventory-name">{item.itemName}</span>
                </section>
            ))}
            <Link href="/dashboard">To Dashboard</Link>
        </main>
    );
}
