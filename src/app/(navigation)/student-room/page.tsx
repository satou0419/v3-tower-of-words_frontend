"use client";
import { useEffect } from "react";
import { useRoomStore } from "@/store/roomStore";
import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./studentroom.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";
import viewStudentRoom from "@/lib/room-endpoint/viewStudentRoom";
import Link from "next/link";

export default function StudentRoom() {
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
                        />
                    ))}
                    <CardNew title="+ Join Room" link="join-room" />
                </div>
            </section>
        </main>
    );
}
