import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./studentroom.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";

export default function StudentRoom() {
    return (
        <main className="studentroom-wrapper">
            <section className="studentroom-container">
                <section className="studentroom-control">
                    <h1>Rooms</h1>
                    <button>My Words</button>
                </section>

                <div className="studentroom-room">
                    <CardRoomGame
                        bannerClass="room-banner"
                        title="Room Name"
                        description="Teacher Name"
                        infoTitle="Game"
                        counter={4}
                        glow={false}
                    />

                    <CardNew title="+ Join Room" link="join-room" />
                </div>
            </section>
        </main>
    );
}
