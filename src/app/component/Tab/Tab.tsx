"use client";
import React, { useState, useEffect } from "react";
import "./tab.scss";

interface TabProps {
    tabs: {
        title: string;
        content: React.ReactNode;
    }[];
}

const Tab: React.FC<TabProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const tabTitles = document.querySelectorAll(".tab-title");
        tabTitles.forEach((tab, index) => {
            tab.classList.remove("tab-title-previous", "tab-title-next");
            if (index === activeTab - 1) {
                tab.classList.add("tab-title-previous");
            }
            if (index === activeTab + 1) {
                tab.classList.add("tab-title-next");
            }
        });
    }, [activeTab]);

    return (
        <main className="tab-wrapper">
            <section className="tab-container">
                <section className="tab-title-container">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            className={`tab-title ${
                                activeTab === index ? "active" : ""
                            }`}
                            onClick={() => setActiveTab(index)}
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
                                activeTab === index ? "active" : ""
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
