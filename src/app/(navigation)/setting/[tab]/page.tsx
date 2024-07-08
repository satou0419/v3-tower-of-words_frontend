// Setting.tsx
"use client";
import Tab from "@/app/component/Tab/Tab";
import React, { useEffect, useState } from "react";
import "./setting.scss";
import { InputLine } from "@/app/component/Input/Input";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import changePassword from "@/lib/auth-endpoint/changePassword";
import useUserInfoStore from "@/store/userInfoStore";
import getUserInfo from "@/lib/user-endpoint/getUserInfo";
import updateUser from "@/lib/auth-endpoint/updateUser";

export default function Setting() {
    const { username } = useUserInfoStore((state) => ({
        username: state.username,
    }));

    const { firstname, lastname, setFirstname, setLastname } =
        useUserInfoStore();

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

    // Fetch user info when component mounts
    useEffect(() => {
        getUserInfo();
    }, []);

    // Set initial values for firstname and lastname fields
    useEffect(() => {
        setFirstname(firstname);
        setLastname(lastname);
    }, [firstname, lastname]);

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

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateUser(firstname, lastname);
            alert("User information updated successfully!");
        } catch (err) {
            console.error("Failed to update user information:", err);
            setError("Failed to update user information. Please try again.");
        }
    };

    const tabData = [
        {
            title: "Personal Information",
            id: "personal-information",
            content: (
                <section className="change-pass_wrapper">
                    <form
                        className="change-pass_form"
                        onSubmit={handleSaveChanges}
                    >
                        <h1>ACCOUNT INFORMATION</h1>
                        <div className="input-group">
                            <InputLine
                                type="text"
                                placeholder="Username"
                                value={username}
                                readOnly
                            />
                            <InputLine
                                type="text"
                                placeholder="Firstname"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                            <InputLine
                                type="text"
                                placeholder="Lastname"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                            />
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
