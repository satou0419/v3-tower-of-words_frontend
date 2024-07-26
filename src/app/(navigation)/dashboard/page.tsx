"use client";

import CardMode from "@/app/component/Card/CardMode/CardMode";
import "./dashboard.scss";
import CardArchive from "@/app/component/Card/CardArchive/CardArchive";
import useUserInfoStore from "@/store/userInfoStore";
import useProgressDashboardStore from "@/store/progressDashboardStore";
import { useEffect } from "react";
import getUserDetails from "@/lib/user-endpoint/getUserDetails";
import viewCreatedRoom from "@/lib/room-endpoint/viewCreatedRoom";
import { useRoomStore } from "@/store/roomStore";
import viewStudentRoom from "@/lib/room-endpoint/viewStudentRoom";

export default function Dashboard() {
    const { rooms, setRoom } = useRoomStore();
    const { userType } = useUserInfoStore.getState();
    const userDashboard = useProgressDashboardStore(
        (state) => state.progressDashboard
    );

    useEffect(() => {
        getUserDetails();
    }, []);

    if (userType.toLowerCase() == "teacher") {
        useEffect(() => {
            const fetchRooms = async () => {
                try {
                    const roomData = await viewCreatedRoom();
                    setRoom(roomData);
                    console.log(roomData);
                } catch (error) {
                    console.error("Failed to fetch rooms:", error);
                    setRoom([]);
                }
            };
            fetchRooms();
        }, [setRoom]);
    } else {
        useEffect(() => {
            const fetchRooms = async () => {
                try {
                    const roomData = await viewStudentRoom();
                    setRoom(roomData);
                } catch (error) {
                    console.error("Failed to fetch rooms:", error);
                }
            };

            fetchRooms();
        }, [setRoom]);
    }

    return (
        <main className="dashboard-wrapper">
            <section className="dashboard-cardmode">
                <CardMode
                    bannerSrc="/assets/images/banner/banner-adventure_large.webp"
                    progressHeader="Floor Completed"
                    progressValue={userDashboard.floorCount}
                    modeTitle="Adventure"
                    modeDescription="This is a custom description for the adventure."
                    link="/tower/spelling"
                />

                <CardMode
                    className="cardmode-simulation"
                    bannerSrc="/assets/images/banner/banner-simulation_large.webp"
                    progressHeader="Room"
                    progressValue={rooms.length}
                    modeTitle="Room"
                    modeDescription="This is a custom description for the room."
                    link={`/${userType.toLowerCase()}-room`}
                />
            </section>
            <CardArchive
                badgesCount={userDashboard.achievementCount}
                wordsCount={userDashboard.wordsCollected}
            />
        </main>
    );
}
