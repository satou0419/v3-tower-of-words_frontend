"use client";
import Tab from "@/app/component/Tab/Tab";
import React, { useEffect, useState } from "react";
import "./setting.scss";
import { InputLine } from "@/app/component/Input/Input";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import changePassword from "@/lib/auth-endpoint/changePassword";

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

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

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

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            await changePassword(currentPassword, newPassword);
            alert("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setError(null);
        } catch (err) {
            setError("Failed to change password. Please try again.");
        }
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
                    <form
                        className="change-pass_form"
                        onSubmit={handlePasswordChange}
                    >
                        <h1>CHANGE PASSWORD</h1>
                        {error && <p className="error">{error}</p>}
                        <div className="input-group">
                            <InputLine
                                type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                            />
                            <InputLine
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <InputLine
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(e) =>
                                    setConfirmNewPassword(e.target.value)
                                }
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
