"use client";

import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./game.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";
import useUserInfoStore from "@/store/userInfoStore";
import { useSimulationStore } from "@/store/simulationStore";
import { useRoomStore } from "@/store/roomStore";
import { useRouter } from "next/navigation";

export default function Game() {
    const { currentRoom } = useRoomStore();
    const { userType } = useUserInfoStore.getState();
    const { simulations, setSimulation } = useSimulationStore();
    const router = useRouter();

    console.log(simulations);

    const handleCardClick = async () => {
        try {
        } catch (error) {
            console.error("Failed to fetch simulations for the room:", error);
        }
    };

    const handleRoomInfoClick = () => {
        router.push("/room-information");
    };

    return (
        <main className="game-wrapper">
            <section className="game-container">
                <section className="game-control">
                    <h1>
                        {currentRoom.name} - Simulations | {currentRoom.code}
                    </h1>
                    <button onClick={handleRoomInfoClick}>
                        Room Information
                    </button>
                </section>

                <div className="game-room">
                    {simulations.map((simulation) => (
                        <CardRoomGame
                            key={simulation.simulationID}
                            bannerClass="room-banner"
                            title={simulation.name}
                            description={simulation.simulationType}
                            infoTitle="Student Done"
                            counter={4}
                            glow={false}
                            // link = {`/${userType.toLowerCase()}-room/game`}
                            onClick={() => handleCardClick()}
                        />
                    ))}
                    <CardNew title="+ Create Game" link={`/game-mode`} />
                </div>
            </section>
        </main>
    );
}
