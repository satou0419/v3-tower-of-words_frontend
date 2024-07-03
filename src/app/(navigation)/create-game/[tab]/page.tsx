"use client";
import Tab from "@/app/component/Tab/Tab";
import React, { useEffect, useState } from "react";
import "./creategame.scss";
import { InputLine } from "@/app/component/Input/Input";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import CardEnemy from "@/app/component/Card/CardEnemy/CardEnemy";

export default function CreateGame() {
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
