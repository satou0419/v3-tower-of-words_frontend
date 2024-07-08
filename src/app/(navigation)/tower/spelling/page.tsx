"use client";
import React, { useEffect, useState, useRef } from "react";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import "./spelling.scss";
import { useFloorStore } from "@/store/floorStore";
import { RewardData } from "@/store/rewardStore";
import { getRewardByFloorId } from "@/lib/reward-endpoint/getRewatdByFloorID";

const Spelling = () => {
    const { floors, getAllFloors } = useFloorStore();
    const [uniqueTowerSections, setUniqueTowerSections] = useState<number[]>(
        []
    );
    const [rewardData, setRewardData] = useState<RewardData | null>(null);
    const [activeFloorId, setActiveFloorId] = useState<number | null>(null);
    const activeFloorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getAllFloors();
    }, [getAllFloors]);

    useEffect(() => {
        const sections = Array.from(
            new Set(floors.map((floor) => floor.towerSection))
        );
        setUniqueTowerSections(sections);
    }, [floors]);

    useEffect(() => {
        if (activeFloorRef.current) {
            activeFloorRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [floors, uniqueTowerSections]);

    useEffect(() => {
        if (activeFloorId) {
            fetchRewardData(activeFloorId);
        }
    }, [activeFloorId]);

    const fetchRewardData = async (floorId: number) => {
        try {
            const data = await getRewardByFloorId(floorId);
            if (data) {
                setRewardData(data);
            } else {
                console.error(
                    "Failed to fetch reward data for floor ID:",
                    floorId
                );
            }
        } catch (error) {
            console.error("Error fetching reward data:", error);
        }
    };

    const handleFloorClick = (floorId: number) => {
        setActiveFloorId(floorId);
    };

    return (
        <main className="spelling-wrapper">
            <section className="spelling-container">
                <section className="spelling-upper">
                    <section className="reward">
                        <CardWord className="reward-container">
                            <h1>Floor {rewardData?.towerFloorID}</h1>

                            <section className="reward-list">
                                <h2>Rewards:</h2>

                                <section className="reward-item">
                                    {/* Credit Reward */}
                                    <section className="reward-box">
                                        <div className="reward-banner">
                                            {rewardData?.adventureRewardCredit !==
                                                undefined && (
                                                <>
                                                    <img
                                                        src="/assets/images/reward/reward-currency.webp"
                                                        alt="reward"
                                                    />
                                                    <span>
                                                        {
                                                            rewardData.adventureRewardCredit
                                                        }
                                                        x
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </section>

                                    {/* Item Reward 1 */}
                                    <section className="reward-box">
                                        <div className="reward-banner">
                                            {rewardData?.rewardItemOne
                                                ?.rewardItem !== undefined && (
                                                <>
                                                    <img
                                                        src={`/assets/images/reward/${rewardData.rewardItemOne.rewardItem.imagePath}`}
                                                        alt={
                                                            rewardData
                                                                .rewardItemOne
                                                                .rewardItem.name
                                                        }
                                                    />
                                                    <span>
                                                        {
                                                            rewardData
                                                                .rewardItemOne
                                                                .rewardItemQuantity
                                                        }
                                                        x
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </section>

                                    {/* Item Reward 2 */}
                                    <section className="reward-box">
                                        <div className="reward-banner">
                                            {rewardData?.rewardItemTwo
                                                ?.rewardItem !== undefined && (
                                                <>
                                                    <img
                                                        src={`/assets/images/reward/${rewardData.rewardItemTwo.rewardItem.imagePath}`}
                                                        alt={
                                                            rewardData
                                                                .rewardItemTwo
                                                                .rewardItem.name
                                                        }
                                                    />
                                                    <span>
                                                        {
                                                            rewardData
                                                                .rewardItemTwo
                                                                .rewardItemQuantity
                                                        }
                                                        x
                                                    </span>
                                                </>
                                            )}
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
                                                floor.towerFloorID ===
                                                activeFloorId
                                                    ? activeFloorRef
                                                    : null
                                            }
                                            onClick={() =>
                                                handleFloorClick(
                                                    floor.towerFloorID
                                                )
                                            }
                                            className={
                                                floor.towerFloorID ===
                                                activeFloorId
                                                    ? "floors active"
                                                    : "floors"
                                            }
                                        >
                                            <span
                                                className={
                                                    floor.towerFloorID ===
                                                    activeFloorId
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
