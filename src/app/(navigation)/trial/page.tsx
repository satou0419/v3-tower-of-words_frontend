"use client";
import React, { useEffect, useState } from "react";
import "./trial.scss";
import useMerriam from "@/hook/useMerriam";
import getUserDetails from "@/lib/user-endpoint/getUserDetails";
import useUserProgressStore from "@/store/userProgressStore";
import useProgressEquippedStore from "@/store/progressEquippedStore";
import useProgressDashboardStore from "@/store/progressDashboardStore";

export default function Trial() {
    const [search, setSearch] = useState("");
    const word = useMerriam(search);

    // Use Zustand hook to get the user progress from the store
    const userProgress = useUserProgressStore((state) => state.userProgress);
    const userEquipped = useProgressEquippedStore(
        (state) => state.progressEquipped
    );
    const userDashboard = useProgressDashboardStore(
        (state) => state.progressDashboard
    );

    const handleChange = (event: any) => {
        setSearch(event.target.value);
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <>
            <h1>User Progress:</h1>
            <ul>
                <li>User Progress ID: {userProgress.userProgressID}</li>
                <li>
                    Tower Section Progress: {userProgress.towerSectionProgress}
                </li>
                <li>Floor ID Progress: {userProgress.floorIDProgress}</li>
            </ul>

            <h1>User Equipped</h1>
            <ul>
                <li>Equipped Character: {userEquipped.equippedCharacter}</li>
                <li>Equipped Badge: {userEquipped.equippedBadge}</li>
            </ul>

            <h1>User Dashboard</h1>
            <ul>
                <li>Credit: {userDashboard.creditAmount}</li>
                <li>Word Count: {userDashboard.wordsCollected}</li>
                <li>Achievement Count: {userDashboard.achievementCount}</li>
                <li>Floor Count: {userDashboard.floorCount}</li>
            </ul>
        </>
    );
}
