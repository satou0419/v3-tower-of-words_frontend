import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./game.scss";

export default function Game() {
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
                    />
                </div>
            </section>
        </main>
    );
}
