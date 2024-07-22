"use client";
import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./teacherroom.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";
import { useRoomStore } from "@/store/roomStore";
import { useSimulationStore } from "@/store/simulationStore";
import useUserInfoStore from "@/store/userInfoStore";
import { useRouter } from "next/navigation";
import viewRoomSimulations from "@/lib/simulation-endpoint/viewRoomSimulations"

export default function TeacherRoom() {
    const { rooms, setCurrentRoom } = useRoomStore();
    const { simulations , setSimulation } = useSimulationStore();
    const { userType } = useUserInfoStore.getState();
    const router = useRouter();

    const handleCardClick = async (room: any) => {
        try {
            const roomSimulation = await viewRoomSimulations(room.roomID);
            setSimulation(roomSimulation);
            setCurrentRoom(room);
            console.log(roomSimulation)
            console.log(room)
        } catch (error) {
            console.error("Failed to fetch simulations for the room:", error);
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
                            counter={room.members.length}
                            glow={false}
                            link = {`/${userType.toLowerCase()}-room/game`}
                            onClick={() => handleCardClick(room)}
                        />
                    ))}
                    <CardNew title="+ Create Room" link="create-room" />
                </div>
            </section>
        </main>
    );
}
