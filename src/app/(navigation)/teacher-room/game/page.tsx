import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./game.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";

export default function CreateGame() {
    return (
        <main className="creategame-wrapper">
            <section className="creategame-container">
                <section className="creategame-control">
                    <h1>Simulation - Name Code</h1>
                    <button>My Words</button>
                </section>

                <div className="creategame-room">
                    <CardRoomGame
                        bannerClass="room-banner"
                        title="Game Name"
                        description="Teacher Name"
                        infoTitle="Student Done"
                        counter={4}
                        glow={false}
                    />

                    <CardNew title="+ Create Game" link="join-room" />
                </div>
            </section>
        </main>
    );
}
