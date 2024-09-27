"use client"
import React, { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CardWord from "@/app/component/Card/CardWord/CardWord"
import "./spelling.scss"
import { useFloorStore } from "@/store/floorStore"
import { RewardData } from "@/store/rewardStore"
import { getEnemyByFloorID } from "@/lib/floor-endpoint/getEnemyByFloorID"
import { getRewardByFloorId } from "@/lib/reward-endpoint/getRewatdByFloorID"
import useUserProgressStore from "@/store/userProgressStore"
import Loading from "@/app/loading"

const Spelling = () => {
    const { floors, getSilentFloors, getSpellingFloors, getSyllableFloors } =
        useFloorStore()
    const { userProgress } = useUserProgressStore()
    const [uniqueTowerSections, setUniqueTowerSections] = useState<number[]>([])
    const [rewardData, setRewardData] = useState<RewardData | null>(null)
    const [activeFloorId, setActiveFloorId] = useState<number | null>(null)
    const [activeSection, setActiveSection] = useState<number | null>(null)
    const [enemyData, setEnemyData] = useState<any | null>(null) // Adjust this type as per your actual enemy data structure
    const [loading, setLoading] = useState(true) // Loading state
    const [activeGameType, setActiveGameType] = useState<string | null>(null)
    const activeFloorRef = useRef<HTMLDivElement>(null)
    const navigation = useRouter()
    const [bannerImage, setBannerImage] = useState("")

    const searchParams = useSearchParams()
    const gameType = searchParams.get("gameType")

    useEffect(() => {
        const fetchFloors = async () => {
            if (gameType === "Silent") {
                setBannerImage("/assets/images/banner/silent-floor-banner.webp")
                await getSilentFloors()
                setLoading(false) // Set loading to false after data is fetched
            }

            if (gameType === "Syllables") {
                await getSyllableFloors()
                setLoading(false) // Set loading to false after data is fetched
                setBannerImage(
                    "/assets/images/banner/syllable-floor-banner.webp"
                )
            }

            if (gameType === "Spelling") {
                await getSpellingFloors()
                setLoading(false) // Set loading to false after data is fetched
                setBannerImage(
                    "/assets/images/banner/spelling-floor-banner.webp"
                )
            }
        }
        fetchFloors()
    }, [getSilentFloors, getSpellingFloors, getSyllableFloors])

    useEffect(() => {
        const sections = Array.from(
            new Set(floors.map((floor) => floor.towerSection))
        )
        setUniqueTowerSections(sections)
    }, [floors])

    useEffect(() => {
        if (
            gameType === "Syllables" &&
            floors.length > 0 &&
            userProgress.syllableFloorID
        ) {
            // Automatically set the active floor ID if it exists in the floors array
            const currentFloor = floors.find(
                (floor) => floor.towerFloorID === userProgress.syllableFloorID
            )
            if (currentFloor) {
                setActiveFloorId(currentFloor.towerFloorID)
                setActiveSection(currentFloor.towerSection)
                setActiveGameType(gameType) // Set the active game type
            }
        } else if (
            gameType === "Spelling" &&
            floors.length > 0 &&
            userProgress.spellingFloorID
        ) {
            // Handle Spelling game type
            const currentFloor = floors.find(
                (floor) => floor.towerFloorID === userProgress.spellingFloorID
            )
            if (currentFloor) {
                setActiveFloorId(currentFloor.towerFloorID)
                setActiveSection(currentFloor.towerSection)
                setActiveGameType(gameType)
            }
        } else if (
            gameType === "Silent" &&
            floors.length > 0 &&
            userProgress.silentFloorID
        ) {
            // Handle Silent game type
            const currentFloor = floors.find(
                (floor) => floor.towerFloorID === userProgress.silentFloorID
            )
            if (currentFloor) {
                setActiveFloorId(currentFloor.towerFloorID)
                setActiveSection(currentFloor.towerSection)
                setActiveGameType(gameType)
            }
        }
    }, [floors, userProgress, gameType])

    useEffect(() => {
        if (activeFloorRef.current) {
            activeFloorRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [activeFloorId, floors, uniqueTowerSections])

    useEffect(() => {
        if (activeFloorId) {
            fetchRewardData(activeFloorId)
            fetchEnemyData(activeFloorId)
        }
    }, [activeFloorId])

    const fetchRewardData = async (floorId: number) => {
        try {
            const data = await getRewardByFloorId(floorId)
            if (data) {
                setRewardData(data)
            } else {
                console.error(
                    "Failed to fetch reward data for floor ID:",
                    floorId
                )
            }
        } catch (error) {
            console.error("Error fetching reward data:", error)
        }
    }

    const fetchEnemyData = async (floorId: number) => {
        try {
            const data = await getEnemyByFloorID(floorId)
            if (data && data.length > 0) {
                setEnemyData(data[0]) // Assuming you only expect one enemy per floor
            } else {
                console.error("No enemy data found for floor ID:", floorId)
            }
        } catch (error) {
            console.error("Error fetching enemy data:", error)
        }
    }

    const handleFloorClick = (
        floorId: number,
        section: number,
        gameType: string | null // Allow null for gameType
    ) => {
        if (gameType === null) {
            console.error("Game type is not set.")
            return
        }

        if (
            gameType === "Syllables" &&
            floorId <= userProgress.syllableFloorID
        ) {
            setActiveFloorId(floorId)
            setActiveSection(section)
            setActiveGameType(gameType)
        } else if (
            gameType === "Spelling" &&
            floorId <= userProgress.spellingFloorID
        ) {
            setActiveFloorId(floorId)
            setActiveSection(section)
            setActiveGameType(gameType)
        } else if (
            gameType === "Silent" &&
            floorId <= userProgress.silentFloorID
        ) {
            setActiveFloorId(floorId)
            setActiveSection(section)
            setActiveGameType(gameType)
        }
    }

    const getNextFloorAndSection = () => {
        // Find the next floor and its section based on the current user progress
        const currentFloorIndex = floors.findIndex(
            (floor) => floor.towerFloorID === activeFloorId
        )
        if (
            currentFloorIndex === -1 ||
            currentFloorIndex === floors.length - 1
        ) {
            return { nextFloorId: null, nextSection: null }
        }

        const nextFloor = floors[currentFloorIndex + 1]
        return {
            nextFloorId: nextFloor.towerFloorID,
            nextSection: nextFloor.towerSection,
        }
    }

    const handleEnterClick = () => {
        if (activeFloorId && activeSection && enemyData) {
            const { nextFloorId, nextSection } = getNextFloorAndSection()
            const isCleared = activeFloorId < activeFloorId

            navigation.push(
                `/gameplay/adventure?floorId=${activeFloorId}&section=${activeSection}&clear=${isCleared}&nextFloorId=${nextFloorId}&nextSection=${nextSection}&gameType=${activeGameType}`
            )
        }
    }

    if (loading) {
        return <Loading /> // Render Loading component while fetching data
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
                        <section
                            className="spelling-banner"
                            style={{
                                backgroundImage: `url(${bannerImage})`,
                            }}
                        >
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
                                                    gameType // Pass gameType here
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
                                                    gameType === "Syllables" &&
                                                    floor.towerFloorID >
                                                        userProgress.syllableFloorID
                                                        ? "locked"
                                                        : gameType ===
                                                              "Spelling" &&
                                                          floor.towerFloorID >
                                                              userProgress.spellingFloorID
                                                        ? "locked"
                                                        : gameType ===
                                                              "Silent" &&
                                                          floor.towerFloorID >
                                                              userProgress.silentFloorID
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
                                            : gameType === "Syllables" &&
                                              userProgress.syllableFloorID >
                                                  section
                                            ? "done-section"
                                            : gameType === "Spelling" &&
                                              userProgress.spellingFloorID >
                                                  section
                                            ? "done-section"
                                            : gameType === "Silent" &&
                                              userProgress.silentFloorID >
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
    )
}

export default Spelling
