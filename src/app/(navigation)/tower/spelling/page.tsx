"use client";
import React, { useEffect, useState, useRef } from "react";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import "./spelling.scss";
import { useFloorStore } from "@/store/floorStore";

const Spelling = () => {
    const { floors, getAllFloors } = useFloorStore();
    const [uniqueTowerSections, setUniqueTowerSections] = useState<number[]>(
        []
    );
    const activeFloorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch all floors when the component mounts
        getAllFloors();
    }, [getAllFloors]);

    useEffect(() => {
        // Extract unique tower sections from fetched floors
        const sections = Array.from(
            new Set(floors.map((floor) => floor.towerSection))
        );
        setUniqueTowerSections(sections);
    }, [floors]);

    useEffect(() => {
        // Scroll to active floor when floors or uniqueTowerSections change
        if (activeFloorRef.current) {
            activeFloorRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [floors, uniqueTowerSections]);

    return (
        <main className="spelling-wrapper">
            <section className="spelling-container">
                <section className="spelling-upper">
                    <section className="reward">
                        <CardWord className="reward-container">
                            <h1>Floor 3</h1>

                            <section className="reward-list">
                                <h2>Rewards:</h2>

                                <section className="reward-item">
                                    <section className="reward-box">
                                        <div className="reward-banner">
                                            <img src="#" alt="reward" />
                                            <span>2x</span>
                                        </div>
                                    </section>

                                    <section className="reward-box">
                                        <div className="reward-banner">
                                            <img src="#" alt="reward" />
                                            <span>2x</span>
                                        </div>
                                    </section>

                                    <section className="reward-box">
                                        <div className="reward-banner">
                                            <img src="#" alt="reward" />
                                            <span>2x</span>
                                        </div>
                                    </section>
                                </section>
                            </section>

                            <button>Enter</button>
                        </CardWord>
                    </section>
                    <section className="tower">
                        <section className="spelling-banner">
                            <section className="floor-container">
                                {floors
                                    .slice()
                                    .reverse()
                                    .map((floor) => (
                                        <div
                                            key={floor.towerFloorID}
                                            ref={
                                                floor.towerFloorID === 3
                                                    ? activeFloorRef
                                                    : null
                                            }
                                            className={
                                                floor.towerFloorID === 3
                                                    ? "floors active"
                                                    : "floors"
                                            }
                                        >
                                            <span
                                                className={
                                                    floor.sectionFloor === 2
                                                        ? ""
                                                        : "locked"
                                                }
                                            >
                                                Floor {floor.towerFloorID}
                                            </span>
                                        </div>
                                    ))}
                            </section>
                        </section>
                    </section>
                </section>

                <section className="spelling-lower">
                    <section className="progress-container">
                        <h1>Progress:</h1>

                        <section className="section-list">
                            {uniqueTowerSections.map((section) => (
                                <span key={section}>Section {section}</span>
                            ))}
                        </section>
                    </section>
                </section>
            </section>
        </main>
    );
};

export default Spelling;
