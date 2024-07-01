import CardRoomGame from "@/app/component/Card/CardRoomGame/CardRoomGame";
import "./teacherroom.scss";
import CardNew from "@/app/component/Card/CardNew/CardNew";

export default function TeacherRoom() {
    return (
        <main className="teacherroom-wrapper">
            <section className="teacherroom-container">
                <section className="teacherroom-control">
                    <h1>Rooms</h1>
                    <button>My Words</button>
                </section>

                <div className="teacherroom-room">
                    <CardRoomGame
                        bannerClass="room-banner"
                        title="Room Name"
                        description="Teacher Name"
                        infoTitle="Game"
                        counter={4}
                        glow={false}
                    />

                    <CardNew title="+ Create Room" link="join-room" />
                </div>
            </section>
        </main>
    );
}
