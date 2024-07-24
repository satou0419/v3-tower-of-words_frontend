"use client";

import { useEffect } from "react";
import { useRoomStore } from "@/store/roomStore";
import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./studentroom.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";
import Link from "next/link";
import useUserInfoStore from "@/store/userInfoStore";
import viewStudentRoom from "@/lib/room-endpoint/viewStudentRoom";
import viewCreatedRoom from "@/lib/room-endpoint/viewCreatedRoom";
import viewRoomSimulations from "@/lib/simulation-endpoint/viewRoomSimulations";
import { useRouter } from "next/navigation";

export default function StudentRoom() {
    const { rooms, setRoom } = useRoomStore();
    const { userType } = useUserInfoStore.getState();

    // Fetch rooms when the component mounts

    const navigation = useRouter();
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                let roomData;
                if (userType.toLowerCase() === "teacher") {
                    roomData = await viewCreatedRoom(); // Fetch data for teachers
                } else {
                    roomData = await viewStudentRoom(); // Fetch data for students
                }
                setRoom(roomData); // Update Zustand store with fetched data
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
                setRoom([]); // Optionally clear the rooms if fetching fails
            }
        };

        fetchRooms();
    }, [setRoom, userType]);

    const handleCardClick = async (room: any) => {
        try {
            const { roomID } = room;
            // Fetch simulations or details for the clicked room
            const simulationData = await viewRoomSimulations(roomID);
            navigation.push(`student-room/game?roomID=${roomID}`);

            console.log("Room Details:", simulationData);
            console.log(roomID);
        } catch (error) {
            console.error("Failed to fetch simulations for the room:", error);
        }
    };

    return (
        <main className="studentroom-wrapper">
            <section className="studentroom-container">
                <section className="studentroom-control">
                    <h1>Rooms</h1>
                    <Link href="/archive/word-vocabulary">My Words</Link>
                </section>

                <div className="studentroom-room">
                    {rooms.map((room) => (
                        <CardRoomGame
                            key={room.roomID}
                            bannerClass="room-banner"
                            title={room.name}
                            description={`Teacher ID: ${room.creatorID}`}
                            infoTitle="Game"
                            counter={room.members.length} // Assuming counter is the number of members
                            glow={false}
                            onClick={() => handleCardClick(room)}
                        />
                    ))}
                    <CardNew title="+ Join Room" link="join-room" />
                </div>
            </section>
        </main>
    );
}
