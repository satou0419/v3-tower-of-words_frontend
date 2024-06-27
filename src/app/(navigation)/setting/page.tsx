"use client";
import Tab from "@/app/component/Tab/Tab";
import React from "react";
import "./setting.scss";
import { InputLine } from "@/app/component/Input/Input";
import { useAuthStore } from "@/store/authStore";

export default function Setting() {
    const { username } = useAuthStore((state) => ({
        username: state.username,
    }));
    const tabData = [
        {
            title: "Personal Information",
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
            <Tab tabs={tabData} />
        </main>
    );
}
