import { InputLine } from "@/app/component/Input/Input";
import "./createroom.scss";

export default function CreateRoom() {
    return (
        <section className="createroom-card">
            <form>
                <h1>Create Room</h1>
                <InputLine type="text" placeholder="Enter Room Name" />
                <div className="createroom-inputgroup">
                    <button type="submit">Create</button>
                    <button type="button">Cancel</button>
                </div>
            </form>
        </section>
    );
}
