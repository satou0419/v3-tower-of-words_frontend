"use client";

import { useEffect, useState } from "react";
import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./teacherroom.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";
import { useRoomStore } from "@/store/roomStore";
import { useSimulationStore } from "@/store/simulationStore";
import { useRouter } from "next/navigation";
import viewCreatedRoom from "@/lib/room-endpoint/viewCreatedRoom";
import viewRoomSimulations from "@/lib/simulation-endpoint/viewRoomSimulations";

export default function TeacherRoom() {
    const { rooms, setRoom, setCurrentRoom } = useRoomStore();
    const { setSimulation } = useSimulationStore();
    const [isClicked, setIsClicked] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const roomData = await viewCreatedRoom();
                setRoom(roomData);
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
            }
        };

        fetchRooms();
    }, [setRoom]);

    const handleCardClick = async (room: any) => {
        if (isClicked) return;
        setIsClicked(true);

        try {
            const roomSimulation = await viewRoomSimulations(room.roomID);
            router.push(`teacher-room/game?roomID=${room.roomID}`);
            setSimulation(roomSimulation);
            setCurrentRoom(room);
            console.log(roomSimulation);
            console.log(room);
        } catch (error) {
            console.error("Failed to fetch simulations for the room:", error);
        } finally {
            setIsClicked(false);
        }
    };

    const handleMyWordsClick = () => {
        router.push("/teacher-word");
    };

    return (
        <main className="teacherroom-wrapper">
            <section className="teacherroom-container">
                <section className="teacherroom-control">
                    <h1>Rooms</h1>
                    <button onClick={handleMyWordsClick}>My Words</button>
                </section>

                <div className="teacherroom-room">
                    {rooms.map((room) => (
                        <CardRoomGame
                            key={room.roomID}
                            bannerClass="room-banner"
                            title={room.name}
                            description={`Teacher ID: ${room.creatorID}`}
                            infoTitle="Game"
                            counter={
                                room.simulations ? room.simulations.length : 0
                            }
                            glow={false}
                            onClick={() => handleCardClick(room)}
                        />
                    ))}
                    <CardNew title="+ Create Room" link="create-room" />
                </div>
            </section>
        </main>
    );
}
