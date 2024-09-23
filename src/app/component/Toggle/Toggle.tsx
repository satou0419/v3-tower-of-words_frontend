"use client";

import React from "react";
import "./toggle.css";

interface ToggleProps {
    label: string;
    isEnabled?: boolean;
    onToggle: (state: boolean) => void;
    className?: string; // Optional className prop
}

const Toggle: React.FC<ToggleProps> = ({
    isEnabled,
    onToggle,
    label,
    className,
}) => {
    const toggleSwitch = () => {
        onToggle(!isEnabled);
    };

    return (
        <main className={`toggle-wrapper ${className}`} onClick={toggleSwitch}>
            <span>{label}</span>
            <section
                className={`toggle-container ${
                    isEnabled ? "enabled" : "disabled"
                }`}
            >
                <div
                    className={`toggle-button ${
                        isEnabled ? "enabled" : "disabled"
                    }`}
                ></div>
            </section>
        </main>
    );
};

export default Toggle;
