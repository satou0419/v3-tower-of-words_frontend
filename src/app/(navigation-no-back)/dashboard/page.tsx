"use client";

import { useState, useEffect } from "react";
import CardMode from "@/app/component/Card/CardMode/CardMode";
import "./dashboard.scss";
import CardArchive from "@/app/component/Card/CardArchive/CardArchive";
import useUserInfoStore from "@/store/userInfoStore";
import useProgressDashboardStore from "@/store/progressDashboardStore";
import getUserDetails from "@/lib/user-endpoint/getUserDetails";
import viewCreatedRoom from "@/lib/room-endpoint/viewCreatedRoom";
import { useRoomStore } from "@/store/roomStore";
import viewStudentRoom from "@/lib/room-endpoint/viewStudentRoom";
import Loading from "@/app/loading";
import useProgressEquippedStore from "@/store/progressEquippedStore";
import TutorialModal from "@/app/component/TutorialModal/TutorialModal";
import Playground from "@/app/(navigation-back-to-dashboard)/tutorial/playground/page";
import useUserGameTutorialStatusStore from "@/store/userGameTutorialStatusStore";

export default function Dashboard() {
    const { rooms, setRoom } = useRoomStore();
    const { userType } = useUserInfoStore.getState();
    const userDashboard = useProgressDashboardStore(
        (state) => state.progressDashboard
    );
    const [loading, setLoading] = useState(true); // Loading state
    const { progressEquipped } = useProgressEquippedStore();
    const { tutorialStatus } = useUserGameTutorialStatusStore(); // Access tutorial state
    const [showTutorial, setShowTutorial] = useState(false); // Modal visibility state

    const handlePlaygroundClick = () => {
        if (!tutorialStatus.firstGamePlayground) {
            setShowTutorial(true);
        } else {
            window.location.href = "/gameplay/playground"; // Redirect if tutorial is not needed
            console.log("true ang playground");
        }
    };

    const renderTutorialPage = () => {
        if (!tutorialStatus.firstGamePlayground) {
            return <Playground />;
        } else {
            handlePlaygroundClick();
            return null; // Always return JSX or null, not undefined
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                if (userType.toLowerCase() === "teacher") {
                    const roomData = await viewCreatedRoom();
                    setRoom(roomData);
                } else {
                    const roomData = await viewStudentRoom();
                    setRoom(roomData);
                }
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
                setRoom([]);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchRooms();
    }, [setRoom, userType]);

    if (loading) {
        return <Loading />; // Render Loading component while fetching data
    }

    return (
        <main className="dashboard-wrapper">
            <section className="dashboard-cardmode">
                <CardMode
                    bannerSrc="/assets/images/banner/banner-adventure_large.webp"
                    progressHeader="Floor Completed"
                    progressValue={userDashboard.floorCount}
                    modeTitle="Adventure"
                    modeDescription="Conquer the three towers and earn some rewards."
                    link="/select-tower"
                    className="dashboard-card"
                />

                <CardMode
                    className="cardmode-simulation"
                    bannerSrc="/assets/images/banner/banner-simulation_large.webp"
                    progressHeader="Room"
                    progressValue={rooms.length}
                    modeTitle="Room"
                    modeDescription={
                        userType.toLowerCase() === "teacher"
                            ? "Create rooms and customize your games for students to conquer"
                            : "Join rooms and ace the games of every room."
                    }
                    link={`/${userType.toLowerCase()}-room`}
                />

                <CardMode
                    bannerSrc="/assets/images/banner/banner-playground_large.png"
                    progressHeader="Words Collected"
                    progressValue={userDashboard.wordsCollected}
                    modeTitle="Playground"
                    modeDescription="Partake in an endless battle against word robots!"
                    className="dashboard-card"
                    onClick={handlePlaygroundClick}
                />
            </section>
            <CardArchive
                badgeEquipped={progressEquipped.equippedBadge}
                badgesCount={userDashboard.achievementCount}
                wordsCount={userDashboard.wordsCollected}
            />
            {showTutorial && (
                <TutorialModal
                    isOpen={showTutorial}
                    onClose={() => setShowTutorial(false)} // Wrap in an arrow function
                    renderTutorialPage={renderTutorialPage}
                />
            )}
        </main>
    );
}
