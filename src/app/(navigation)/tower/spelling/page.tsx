"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import CardWord from "@/app/component/Card/CardWord/CardWord";
import "./spelling.scss";
import { useFloorStore } from "@/store/floorStore";
import { RewardData } from "@/store/rewardStore";
import { getEnemyByFloorID } from "@/lib/floor-endpoint/getEnemyByFloorID";
import { getRewardByFloorId } from "@/lib/reward-endpoint/getRewatdByFloorID";
import useUserProgressStore from "@/store/userProgressStore";
import Loading from "@/app/loading";

const Spelling = () => {
    const { floors, getAllFloors } = useFloorStore();
    const { userProgress } = useUserProgressStore();
    const [uniqueTowerSections, setUniqueTowerSections] = useState<number[]>(
        []
    );
    const [rewardData, setRewardData] = useState<RewardData | null>(null);
    const [activeFloorId, setActiveFloorId] = useState<number | null>(null);
    const [activeSection, setActiveSection] = useState<number | null>(null);
    const [enemyData, setEnemyData] = useState<any | null>(null); // Adjust this type as per your actual enemy data structure
    const [loading, setLoading] = useState(true); // Loading state
    const activeFloorRef = useRef<HTMLDivElement>(null);
    const navigation = useRouter();

    useEffect(() => {
        const fetchFloors = async () => {
            await getAllFloors();
            setLoading(false); // Set loading to false after data is fetched
        };
        fetchFloors();
    }, [getAllFloors]);

    useEffect(() => {
        const sections = Array.from(
            new Set(floors.map((floor) => floor.towerSection))
        );
        setUniqueTowerSections(sections);
    }, [floors]);

    useEffect(() => {
        if (floors.length > 0 && userProgress.floorIDProgress) {
            // Automatically set the active floor ID if it exists in the floors array
            const currentFloor = floors.find(
                (floor) => floor.towerFloorID === userProgress.floorIDProgress
            );
            if (currentFloor) {
                setActiveFloorId(currentFloor.towerFloorID);
                setActiveSection(currentFloor.towerSection);
            }
        }
    }, [floors, userProgress.floorIDProgress]);

    useEffect(() => {
        if (activeFloorRef.current) {
            activeFloorRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [activeFloorId, floors, uniqueTowerSections]);

    useEffect(() => {
        if (activeFloorId) {
            fetchRewardData(activeFloorId);
            fetchEnemyData(activeFloorId);
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

    const fetchEnemyData = async (floorId: number) => {
        try {
            const data = await getEnemyByFloorID(floorId);
            if (data && data.length > 0) {
                setEnemyData(data[0]); // Assuming you only expect one enemy per floor
            } else {
                console.error("No enemy data found for floor ID:", floorId);
            }
        } catch (error) {
            console.error("Error fetching enemy data:", error);
        }
    };

    const [activeGameType, setActiveGameType] = useState<number | null>(null);

    const handleFloorClick = (
        floorId: number,
        section: number,
        gameType: number
    ) => {
        if (floorId <= userProgress.floorIDProgress) {
            setActiveFloorId(floorId);
            setActiveSection(section);
            setActiveGameType(gameType); // Set the active game type
        }
    };

    const getNextFloorAndSection = () => {
        // Find the next floor and its section based on the current user progress
        const currentFloorIndex = floors.findIndex(
            (floor) => floor.towerFloorID === userProgress.floorIDProgress
        );
        if (
            currentFloorIndex === -1 ||
            currentFloorIndex === floors.length - 1
        ) {
            return { nextFloorId: null, nextSection: null };
        }

        const nextFloor = floors[currentFloorIndex + 1];
        return {
            nextFloorId: nextFloor.towerFloorID,
            nextSection: nextFloor.towerSection,
        };
    };

    useEffect(() => {});
    const handleEnterClick = () => {
        if (activeFloorId && activeSection && enemyData) {
            const { nextFloorId, nextSection } = getNextFloorAndSection();
            const isCleared = activeFloorId < userProgress.floorIDProgress;

            navigation.push(
                `/gameplay/adventure?floorId=${activeFloorId}&section=${activeSection}&clear=${isCleared}&nextFloorId=${nextFloorId}&nextSection=${nextSection}&gameType=${activeGameType}`
            );
        }
    };

    if (loading) {
        return <Loading />; // Render Loading component while fetching data
    }

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
                                                        }{" "}
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
                                                        }{" "}
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
                                                        }{" "}
                                                        x
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </section>
                                </section>
                            </section>
                            <div className="btn-enter">
                                <button onClick={handleEnterClick}>
                                    Enter
                                </button>
                            </div>
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
                                                    floor.towerFloorID,
                                                    floor.towerSection,
                                                    floor.gameType // Pass gameType here
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
                                                    floor.towerFloorID >
                                                    userProgress.floorIDProgress
                                                        ? "locked"
                                                        : ""
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
                                <span
                                    key={section}
                                    className={`section ${
                                        activeSection === section
                                            ? "active-section"
                                            : userProgress.floorIDProgress >
                                              section
                                            ? "done-section"
                                            : ""
                                    }`}
                                >
                                    Section {section}
                                </span>
                            ))}
                        </section>
                    </section>
                </section>
            </section>
        </main>
    );
};

export default Spelling;
