// SettingsTab.tsx
import React, { useState } from "react";
import { InputBox } from "@/app/component/Input/Input";
import Toggle from "@/app/component/Toggle/Toggle";

const SettingsTab = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    const handleToggle = (state: boolean) => {
        setIsEnabled(state);
    };

    return (
        <main className="setting-wrapper">
            <section className="setting">
                <InputBox type="text" placeholder="Enter Simulation Name" />
                <InputBox type="time" />
                <select>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
                <select>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
                <Toggle
                    className="toggle"
                    label="Items"
                    isEnabled={isEnabled}
                    onToggle={handleToggle}
                />
                <Toggle
                    className="toggle"
                    label="Description"
                    isEnabled={isEnabled}
                    onToggle={handleToggle}
                />
                <Toggle
                    className="toggle"
                    label="Allow Replay"
                    isEnabled={isEnabled}
                    onToggle={handleToggle}
                />
            </section>
        </main>
    );
};

export default SettingsTab;
