import { InputLine } from "@/app/component/Input/Input";
import "./joinroom.scss";

export default function JoinRoom() {
    return (
        <main className="joinroom-wrapper">
            <section className="joinroom-container">
                <section className="joinroom-card">
                    <form>
                        <h1>Join Room</h1>
                        <div className="joinroom-inputgroup">
                            <InputLine
                                type="text"
                                placeholder="Enter Tower Code"
                            />
                            <button type="submit">Join now</button>
                            <button type="button">Cancel</button>
                        </div>
                    </form>
                </section>

                <section className="joincard-banner">
                    <img src="/assets/images/banner/banner-joinroom.webp" />
                </section>
            </section>
        </main>
    );
}
