"use client";
import React, { useEffect, useState } from "react";
import "./trial.scss";

export default function Trial() {
    const [isHit, setIsHit] = useState(false);

    const [setDuration] = useState(22 / 12);

    useEffect(() => {
        console.log(setDuration);
    });
    const handleHitAnimation = () => {
        setIsHit(true);
        setTimeout(() => {
            setIsHit(false);
        }, setDuration * 1000); // Adjust timeout to match total animation duration
    };

    return (
        <main className="trial-wrapper">
            <section>
                <div className="first-container">
                    <div className={"idle"}></div>
                </div>
                <div className="second-container">
                    <div className="bg-range_character_cannon_attack_22"></div>
                </div>
            </section>
            <button onClick={handleHitAnimation}>Attack</button>
        </main>
    );
}
