"use client"

import { useState, useEffect } from "react"
import CardMode from "@/app/component/Card/CardMode/CardMode"
import "./dashboard.scss"
import CardArchive from "@/app/component/Card/CardArchive/CardArchive"
import useUserInfoStore from "@/store/userInfoStore"
import useProgressDashboardStore from "@/store/progressDashboardStore"
import getUserDetails from "@/lib/user-endpoint/getUserDetails"
import viewCreatedRoom from "@/lib/room-endpoint/viewCreatedRoom"
import { useRoomStore } from "@/store/roomStore"
import viewStudentRoom from "@/lib/room-endpoint/viewStudentRoom"
import Loading from "@/app/loading"

export default function Dashboard() {
    const { rooms, setRoom } = useRoomStore()
    const { userType } = useUserInfoStore.getState()
    const userDashboard = useProgressDashboardStore(
        (state) => state.progressDashboard
    )
    const [loading, setLoading] = useState(true) // Loading state

    useEffect(() => {
        getUserDetails()
    }, [])

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                if (userType.toLowerCase() === "teacher") {
                    const roomData = await viewCreatedRoom()
                    setRoom(roomData)
                } else {
                    const roomData = await viewStudentRoom()
                    setRoom(roomData)
                }
            } catch (error) {
                console.error("Failed to fetch rooms:", error)
                setRoom([])
            } finally {
                setLoading(false) // Set loading to false after data is fetched
            }
        }

        fetchRooms()
    }, [setRoom, userType])

    if (loading) {
        return <Loading /> // Render Loading component while fetching data
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
                    className="dashboard-card"
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

                <CardMode
                    bannerSrc="/assets/images/banner/banner-adventure_large.webp"
                    progressHeader="Words Available"
                    progressValue={userDashboard.floorCount}
                    modeTitle="Playground"
                    modeDescription="This is a custom description for the adventure."
                    link="/tower/spelling"
                    className="dashboard-card"
                />
            </section>
            <CardArchive
                badgesCount={userDashboard.achievementCount}
                wordsCount={userDashboard.wordsCollected}
            />
        </main>
    )
}
