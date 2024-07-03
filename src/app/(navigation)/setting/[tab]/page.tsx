"use client";
import Tab from "@/app/component/Tab/Tab";
import React, { useEffect, useState } from "react";
import "./setting.scss";
import { InputLine } from "@/app/component/Input/Input";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";

export default function Setting() {
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
        router.push(`/setting/${tab}`);
    };

    const tabData = [
        {
            title: "Personal Information",
            id: "personal-information",
            content: (
                <section className="change-pass_wrapper">
                    <form className="change-pass_form">
                        <h1>ACCOUNT INFORMATION</h1>
                        <div className="input-group">
                            <InputLine
                                type="text"
                                placeholder="Username"
                                value={username}
                                readOnly
                            />
                            <InputLine type="text" placeholder="Firstname" />
                            <InputLine type="text" placeholder="Lastname" />
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                </section>
            ),
        },
        {
            title: "Change Password",
            id: "change-password",
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
        <main className="setting-wrapper">
            <Tab
                tabs={tabData}
                currentTab={activeTab}
                onTabChange={handleTabChange}
            />
        </main>
    );
}
