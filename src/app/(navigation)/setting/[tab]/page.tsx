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

    const [localFirstname, setLocalFirstname] = useState(firstname);
    const [localLastname, setLocalLastname] = useState(lastname);

    const [initialLocalFirstname, setInitialLocalFirstname] =
        useState(firstname);
    const [initialLocalLastname, setInitialLocalLastname] = useState(lastname);

    const [isDirty, setIsDirty] = useState(false); // Track form dirty state

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
        getUserInfo();
    }, []);

    useEffect(() => {
        setLocalFirstname(firstname);
        setLocalLastname(lastname);
        setInitialLocalFirstname(firstname);
        setInitialLocalLastname(lastname);
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
            await updateUser(localFirstname, localLastname);
            setFirstname(localFirstname); // Update the Zustand store only after successful save
            setLastname(localLastname);
            alert("User information updated successfully!");
            setIsDirty(false); // Reset dirty state after successful save
            setInitialLocalFirstname(localFirstname); // Update initial values
            setInitialLocalLastname(localLastname);
        } catch (err) {
            console.error("Failed to update user information:", err);
            setError("Failed to update user information. Please try again.");
        }
    };

    // Check if there are changes from initial values
    useEffect(() => {
        setIsDirty(
            localFirstname !== initialLocalFirstname ||
                localLastname !== initialLocalLastname
        );
    }, [
        localFirstname,
        localLastname,
        initialLocalFirstname,
        initialLocalLastname,
    ]);

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
                                value={localFirstname}
                                onChange={(e) => {
                                    setLocalFirstname(e.target.value);
                                }}
                            />
                            <InputLine
                                type="text"
                                placeholder="Lastname"
                                value={localLastname}
                                onChange={(e) => {
                                    setLocalLastname(e.target.value);
                                }}
                            />
                        </div>
                        <button type="submit" disabled={!isDirty}>
                            Save Changes
                        </button>
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
