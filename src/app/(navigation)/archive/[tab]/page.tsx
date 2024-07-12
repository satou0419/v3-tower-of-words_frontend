"use client";
import Tab from "@/app/component/Tab/Tab";
import "./archive.scss";
import Words from "./Words";
import useTabManagement from "@/hook/useTab";
import Badges from "./Badges";

const Archive = () => {
    const { activeTab, handleTabChange } = useTabManagement(
        "/archive",
        "word-vocabulary"
    );
    const tabData = [
        {
            title: "Words",
            id: "word-vocabulary",
            content: <Words />,
        },
        {
            title: "Badges",
            id: "badges",
            content: <Badges />,
        },
    ];

    return (
        <main className="archive-wrapper">
            <Tab
                tabs={tabData}
                currentTab={activeTab}
                onTabChange={handleTabChange}
            />
        </main>
    );
};

export default Archive;
