"use client";
import Tab from "@/app/component/Tab/Tab";
import React, { useEffect, useState } from "react";
import "./creategame.scss";
import { InputBox, InputLine } from "@/app/component/Input/Input";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import CardEnemy from "@/app/component/Card/CardEnemy/CardEnemy";
import Toggle from "@/app/component/Toggle/Toggle";

export default function CreateGame() {
    const [isEnabled, setIsEnabled] = useState(false);

    const handleToggle = (state: boolean) => {
        setIsEnabled(state);
    };
    const { username } = useAuthStore((state) => ({
        username: state.username,
    }));

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
                : "personal-information";
        setActiveTab(currentTab);
    }, [pathname]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/create-game/${tab}`);
    };

    const tabData = [
        {
            title: "Words",
            id: "my-word",
            content: (
                <section className="myword-wrapper">
                    <section className="myword-left_container">
                        <h1>My Words</h1>
                        <CardWord className="myword-left"></CardWord>
                    </section>

                    <section className="myword-right_container">
                        <h1>Enemy List</h1>
                        <section className="enemylist-container">
                            <CardEnemy />
                        </section>
                    </section>
                </section>
            ),
        },

        {
            title: "Setting",
            id: "setting",
            content: (
                <main className="setting-wrapper">
                    <section className="setting">
                        <InputBox
                            type="text"
                            placeholder="Enter Simulation Name"
                        />
                        <InputBox type="time" />
                        <select>
                            <option>1</option>
                            <option>1</option>
                            <option>1</option>
                            <option>1</option>
                        </select>
                        <select>
                            <option>1</option>
                            <option>1</option>
                            <option>1</option>
                            <option>1</option>
                        </select>
                        <Toggle
                            className="toggle"
                            label="Items"
                            isEnabled={isEnabled}
                            onToggle={handleToggle}
                        />

                        <Toggle
                            className="toggle"
                            label="Description"
                            isEnabled={isEnabled}
                            onToggle={handleToggle}
                        />

                        <Toggle
                            className="toggle"
                            label="Allow Replay"
                            isEnabled={isEnabled}
                            onToggle={handleToggle}
                        />
                    </section>
                </main>
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
