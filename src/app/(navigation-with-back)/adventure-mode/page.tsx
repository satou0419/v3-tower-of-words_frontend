"use client"
import React, { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import "./adventure-mode.scss"
import { useFloorStore } from "@/store/floorStore"
import { RewardData } from "@/store/rewardStore"
import { getEnemyByFloorID } from "@/lib/floor-endpoint/getEnemyByFloorID"
import { getRewardByFloorId } from "@/lib/reward-endpoint/getRewatdByFloorID"
import useUserProgressStore from "@/store/userProgressStore"
import Loading from "@/app/loading"
import AdventureSilent from "../../(navigation-back-to-dashboard)/tutorial/adventure-silent/page"
import AdventureSpelling from "../../(navigation-back-to-dashboard)/tutorial/adventure-spelling/page"
import AdventureSyllable from "../../(navigation-back-to-dashboard)/tutorial/adventure-syllable/page"
import TutorialModal from "@/app/component/TutorialModal/TutorialModal"
import useTutorialStatus from "@/hook/useTutorialStatus"
import useUserGameTutorialStatusStore from "@/store/userGameTutorialStatusStore"
import useUpdateTutorialStatus from "@/hook/useUpdateTutorialStatus "
import { useTutorialStore } from "@/store/useTutorialStore"

const AdventureMode = () => {
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
    const [showTutorial, setShowTutorial] = useState(false)

    const activeFloorRef = useRef<HTMLDivElement>(null)
    const activeSectionRef = useRef<HTMLDivElement>(null)

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

    const [closeModalTut, setCloseModalTut] = useState(false)
    useEffect(() => {
        if (showTutorial === false) {
            setCloseModalTut(true)
        }
    }, [setShowTutorial])

    useEffect(() => {
        if (activeFloorRef.current) {
            activeFloorRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [activeFloorId, floors, uniqueTowerSections])

    // Create a ref for each section
    const sectionRefs = useRef<any>({})

    useEffect(() => {
        if (activeSection !== null && sectionRefs.current[activeSection]) {
            // Scroll to the section when it is active
            sectionRefs.current[activeSection].scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    }, [activeSection]) // Dependency on activeSection

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

        // Check if the floor is locked based on the game type and user progress
        const isLocked = () => {
            switch (gameType) {
                case "Syllables":
                    return floorId > userProgress.syllableFloorID
                case "Spelling":
                    return floorId > userProgress.spellingFloorID
                case "Silent":
                    return floorId > userProgress.silentFloorID
                default:
                    return false
            }
        }

        // Only allow the user to enter if the floor is not locked
        if (isLocked()) {
            alert(
                "This floor is locked. Please complete previous floors to proceed."
            )
            return
        }

        setActiveFloorId(floorId)
        setActiveSection(section)
        setActiveGameType(gameType)
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
        if (!activeFloorId || !activeSection || !enemyData) {
            return // Ensure the necessary data is available
        }

        // Check if the current floor is locked before proceeding
        const isLocked = () => {
            switch (activeGameType) {
                case "Syllables":
                    return activeFloorId > userProgress.syllableFloorID
                case "Spelling":
                    return activeFloorId > userProgress.spellingFloorID
                case "Silent":
                    return activeFloorId > userProgress.silentFloorID
                default:
                    return false
            }
        }

        // If the floor is locked, prevent the user from proceeding
        if (isLocked()) {
            alert(
                "This floor is locked. Please complete previous floors to proceed."
            )
            return // Prevent the navigation
        }

        if (gameType) {
            setShowTutorial(true) // Show the tutorial if the game type is set
        }

        // Get the next floor and section to navigate to
        const { nextFloorId, nextSection } = getNextFloorAndSection()

        // Calculate whether the current floor is cleared
        const isCleared = activeFloorId < activeFloorId

        if (closeModalTut === true) {
            setShowTutorial(true)
        }
    }

    const router = useRouter()

    const [activeFloorsInSection, setActiveFloorsInSection] = useState<any[]>(
        []
    ) // Store floors of the active section
    const [activeFloorIds, setActiveFloorIds] = useState<number[]>([])

    // Scroll to the selected section when it becomes active
    useEffect(() => {
        if (activeSection !== null && sectionRefs.current[activeSection]) {
            sectionRefs.current[activeSection]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    }, [activeSection])

    const handleSectionClick = (section: number) => {
        setActiveSection(section) // Set the active section

        // Filter floors by the selected section
        const sectionFloors = floors.filter(
            (floor) => floor.towerSection === section
        )

        // Set the active floors for the selected section
        setActiveFloorsInSection(sectionFloors)

        // Automatically set the last floor of the section as the active floor
        if (sectionFloors.length > 0) {
            setActiveFloorId(
                sectionFloors[sectionFloors.length - 1].towerFloorID
            ) // Set the active floor to the last floor
        }
    }

    useEffect(() => {
        const gameType = new URLSearchParams(window.location.search).get(
            "gameType"
        )
        setActiveGameType(gameType)
        // if (gameType) {
        //     setShowTutorial(true) // Show the tutorial if the game type is set
        // }
    }, [])

    const { error } = useTutorialStatus() // Using the custom hook
    const tutorialStatus = useUserGameTutorialStatusStore(
        (state) => state.tutorialStatus
    )

    const handleTutorialFinish = async () => {
        const { nextFloorId, nextSection } = getNextFloorAndSection()

        try {
            if (
                gameType === "Silent" &&
                !tutorialStatus.firstGameSilentAdventure
            ) {
            } else if (
                gameType === "Spelling" &&
                !tutorialStatus.firstGameSpellingAdventure
            ) {
            } else if (
                gameType === "Syllables" &&
                !tutorialStatus.firstGameSyllableAdventure
            ) {
            }

            // Navigate only after updating tutorial status
            navigation.push(
                `/gameplay/adventure?floorId=${activeFloorId}&section=${activeSection}&clear=true&nextFloorId=${nextFloorId}&nextSection=${nextSection}&gameType=${activeGameType}`
            )
        } catch (error) {
            console.error(
                "Failed to update tutorial status before navigating:",
                error
            )
        }
    }

    const renderTutorialPage = () => {
        switch (activeGameType) {
            case "Silent":
                if (!tutorialStatus.firstGameSilentAdventure) {
                    return <AdventureSilent />
                } else {
                    handleTutorialFinish()
                    return null // Always return JSX or null, not undefined
                }
            case "Spelling":
                if (!tutorialStatus.firstGameSpellingAdventure) {
                    return <AdventureSpelling />
                } else {
                    handleTutorialFinish()
                    return null // Always return JSX or null, not undefined
                }
            case "Syllables":
                if (!tutorialStatus.firstGameSyllableAdventure) {
                    return <AdventureSyllable />
                } else {
                    handleTutorialFinish()
                    return null // Always return JSX or null, not undefined
                }
            default:
                return null // Always return JSX or null, not undefined
        }
    }

    if (loading) {
        return <Loading /> // Render Loading component while fetching data
    }

    return (
        <main className="spelling-wrapper">
            {showTutorial && (
                <TutorialModal
                    isOpen={showTutorial}
                    onClose={() => setShowTutorial(false)} // Wrap in an arrow function
                    renderTutorialPage={renderTutorialPage}
                />
            )}

            <section className="spelling-container">
                <section className="spelling-upper">
                    <section className="reward">
                        <section className="reward-container">
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
                            <button
                                className="btn-enter"
                                onClick={handleEnterClick}
                            >
                                Enter
                            </button>
                        </section>
                    </section>

                    {/* Tower To Edit */}

                    <section className="tower">
                        <section className="tower-container">
                            {floors
                                .slice()
                                .reverse()
                                .map((floor) => {
                                    const isActive =
                                        floor.towerFloorID === activeFloorId
                                    const isInActiveSection =
                                        activeFloorsInSection.some(
                                            (f) =>
                                                f.towerFloorID ===
                                                floor.towerFloorID
                                        ) // Check if the floor belongs to the active section

                                    const isLocked = () => {
                                        switch (gameType) {
                                            case "Syllables":
                                                return (
                                                    floor.towerFloorID >
                                                    userProgress.syllableFloorID
                                                )
                                            case "Spelling":
                                                return (
                                                    floor.towerFloorID >
                                                    userProgress.spellingFloorID
                                                )
                                            case "Silent":
                                                return (
                                                    floor.towerFloorID >
                                                    userProgress.silentFloorID
                                                )
                                            default:
                                                return false
                                        }
                                    }

                                    return (
                                        <section
                                            key={floor.towerFloorID}
                                            className="img-container"
                                        >
                                            <img
                                                src={bannerImage}
                                                loading="lazy"
                                                className="tower-img"
                                                alt={`Banner for floor ${floor.towerFloorID}`}
                                            />

                                            <div
                                                className={`tower-floor ${
                                                    isLocked() ? "locked" : ""
                                                } ${isActive ? "active" : ""} ${
                                                    isInActiveSection
                                                        ? "glowing"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleFloorClick(
                                                        floor.towerFloorID,
                                                        floor.towerSection,
                                                        gameType
                                                    )
                                                }
                                                ref={
                                                    isActive
                                                        ? activeFloorRef
                                                        : null
                                                }
                                            >
                                                Floor {floor.towerFloorID}
                                            </div>
                                        </section>
                                    )
                                })}
                        </section>
                    </section>
                </section>

                {/* End of Tower to Edit */}

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
                                              userProgress.syllableFloorID >=
                                                  section
                                            ? "done-section"
                                            : gameType === "Spelling" &&
                                              userProgress.spellingFloorID >=
                                                  section
                                            ? "done-section"
                                            : gameType === "Silent" &&
                                              userProgress.silentFloorID >=
                                                  section
                                            ? "done-section"
                                            : ""
                                    }`}
                                    onClick={() => handleSectionClick(section)} // Add onClick handler
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

export default AdventureMode
