"use client";

import { useRoomStore } from "@/store/roomStore";
import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./studentroom.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";
import Link from "next/link";
import useUserInfoStore from "@/store/userInfoStore";

export default function StudentRoom() {
    const { rooms } = useRoomStore();
    const { userType } = useUserInfoStore.getState();

    const handleCardClick = async (room: any) => {
        try {
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
                            link={`/${userType.toLowerCase()}-room/game`}
                            onClick={() => handleCardClick(room)}
                        />
                    ))}
                    <CardNew title="+ Join Room" link="join-room" />
                </div>
            </section>
        </main>
    );
}
