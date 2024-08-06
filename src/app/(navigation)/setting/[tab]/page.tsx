"use client";
import Tab from "@/app/component/Tab/Tab";
import React from "react";
import "./setting.scss";
import PersonalInformation from "./PersonalInformation/PersonalInformation";
import ChangePassword from "./ChangePassword/ChangePassword";
import useTabManagement from "@/hook/useTab";

const Setting = () => {
    const { activeTab, handleTabChange } = useTabManagement(
        "/setting",
        "personal-information"
    );

    const tabData = [
        {
            title: "Personal Information",
            id: "personal-information",
            content: <PersonalInformation />,
        },
        {
            title: "Change Password",
            id: "change-password",
            content: <ChangePassword />,
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
};

export default Setting;
