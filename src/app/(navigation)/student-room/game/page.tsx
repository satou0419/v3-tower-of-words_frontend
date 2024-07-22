import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./game.scss";
import useUserInfoStore from "@/store/userInfoStore";

const handleCardClick = async () => {
    try {
        
    } catch (error) {
        console.error("Failed to fetch simulations for the room:", error);
    }
};

export default function Game() {
    const { userType } = useUserInfoStore.getState();

    return (
        <main className="game-wrapper">
            <section className="game-container">
                <section className="game-control">
                    <h1>Simulation - Name Code</h1>
                </section>

                <div className="game-room">
                    <CardRoomGame
                        bannerClass="room-banner"
                        title="Game Name"
                        description="Teacher Name"
                        infoTitle="Score"
                        counter={4}
                        glow={false}
                        link = {`/${userType.toLowerCase()}-room/game`}
                        onClick={() => handleCardClick()}
                    />
                </div>
            </section>
        </main>
    );
}
