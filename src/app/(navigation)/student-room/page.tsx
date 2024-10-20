"use client";

import { useEffect, useState } from "react";
import { useRoomStore } from "@/store/roomStore";
import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./studentroom.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";
import useUserInfoStore from "@/store/userInfoStore";
import viewStudentRoom from "@/lib/room-endpoint/viewStudentRoom";
import viewCreatedRoom from "@/lib/room-endpoint/viewCreatedRoom";
import viewRoomSimulations from "@/lib/simulation-endpoint/viewRoomSimulations";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function StudentRoom() {
    const { rooms, setRoom } = useRoomStore();
    const { userType } = useUserInfoStore.getState();
    const [loading, setLoading] = useState(true);
    const [isClicked, setIsClicked] = useState(false);
    const navigation = useRouter();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                let roomData;
                if (userType.toLowerCase() === "teacher") {
                    roomData = await viewCreatedRoom();
                } else {
                    roomData = await viewStudentRoom();
                }
                setRoom(roomData);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
                setRoom([]);
                setLoading(false);
            }
        };

        fetchRooms();
    }, [setRoom, userType]);

    const handleCardClick = async (room: any) => {
        if (isClicked) return;
        setIsClicked(true);

        try {
            const { roomID } = room;
            const simulationData = await viewRoomSimulations(roomID);
            navigation.push(`student-room/game?roomID=${roomID}`);

            console.log("Room Details:", simulationData);
            console.log(roomID);
        } catch (error) {
            console.error("Failed to fetch simulations for the room:", error);
        } finally {
            setIsClicked(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <main className="studentroom-wrapper">
            <section className="studentroom-container">
                <section className="studentroom-control">
                    <h1>Rooms</h1>
                </section>

                <div className="studentroom-room">
                    {rooms.map((room) => (
                        <CardRoomGame
                            key={room.roomID}
                            bannerClass="/assets/images/banner/banner-tower.png"
                            title={room.name}
                            description={`Teacher ID: ${room.creatorID}`}
                            infoTitle="Game"
                            counter={room.simulations.length}
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
