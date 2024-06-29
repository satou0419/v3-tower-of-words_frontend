"use client";
import Tab from "@/app/component/Tab/Tab";
import React, { useEffect, useState } from "react";
import "./item.scss";
import { InputLine } from "@/app/component/Input/Input";
import { useRouter, usePathname } from "next/navigation";

export default function Item() {
    const router = useRouter();
    const pathname = usePathname();
    const pathSegments = pathname.split("/");

    const initialTab =
        pathSegments.length > 2 ? pathSegments[2] : "personal-information";
    const [activeTab, setActiveTab] = useState<string>(initialTab);

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

    const tabData = [
        {
            title: "Inventory",
            id: "inventory",
            content: (
                <section className="inventory_wrapper">
                    <section className="inventory-item"></section>
                    <section className="inventory-item_detail"></section>
                </section>
            ),
        },
        {
            title: "Shop",
            id: "shop",
            content: (
                <section className="change-pass_wrapper">
                    <form className="change-pass_form">
                        <h1>CHANGE PASSWORD</h1>
                        <div className="input-group">
                            <InputLine
                                type="password"
                                placeholder="Current Password"
                            />
                            <InputLine
                                type="password"
                                placeholder="New Password"
                            />
                            <InputLine
                                type="password"
                                placeholder="Confirm New Password"
                            />
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
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
