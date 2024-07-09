"use client";
import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./teacherroom.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";
import { useRoomStore } from "@/store/roomStore";
import { useEffect } from "react";
import viewStudentRoom from "@/lib/room-endpoint/viewStudentRoom";

export default function TeacherRoom() {
    const { rooms, setRoom } = useRoomStore();

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
    return (
        <main className="teacherroom-wrapper">
            <section className="teacherroom-container">
                <section className="teacherroom-control">
                    <h1>Rooms</h1>
                    <button>My Words</button>
                </section>

                <div className="teacherroom-room">
                    {rooms.map((room) => (
                        <CardRoomGame
                            key={room.roomID}
                            bannerClass="room-banner"
                            title={room.name}
                            description={`Teacher ID: ${room.creatorID}`}
                            infoTitle="Game"
                            counter={room.members.length} // Assuming counter is the number of members
                            glow={false}
                        />
                    ))}

                    <CardNew title="+ Create Room" link="join-room" />
                </div>
            </section>
        </main>
    );
}
