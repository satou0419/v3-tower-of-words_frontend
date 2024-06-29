import React, { useEffect } from "react";
import "./tab.scss";

interface TabProps {
    tabs: {
        title: string;
        id: string;
        content: React.ReactNode;
    }[];
    currentTab: string;
    onTabChange: (tabId: string) => void;
}

const Tab: React.FC<TabProps> = ({ tabs, currentTab, onTabChange }) => {
    useEffect(() => {
        const activeIndex = tabs.findIndex((tab) => tab.id === currentTab);
        if (activeIndex === -1) {
            onTabChange(tabs[0].id); // Fallback to the first tab if no match is found
        }

        const tabTitles = document.querySelectorAll(".tab-title");
        tabTitles.forEach((tab, index) => {
            tab.classList.remove("tab-title-previous");
            if (index === activeIndex - 1) {
                tab.classList.add("tab-title-previous");
            }
        });
    }, [currentTab, tabs, onTabChange]);

    return (
        <main className="tab-wrapper">
            <section className="tab-container">
                <section className="tab-title-container">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            className={`tab-title ${
                                currentTab === tab.id ? "active" : ""
                            }`}
                            onClick={() => onTabChange(tab.id)}
                        >
                            {tab.title}
                        </div>
                    ))}
                </section>

                <section className="tab-content-container">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            className={`tab-content ${
                                currentTab === tab.id ? "active" : ""
                            }`}
                        >
                            {tab.content}
                        </div>
                    ))}
                </section>
            </section>
        </main>
    );
};

export default Tab;
