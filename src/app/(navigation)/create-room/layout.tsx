import { Metadata } from "next"
import CreateRoom from "./page"

export const metadata: Metadata = {
    title: "Create Room",
    description:
        "The create room feature is where the user can create a room for their friends to join in.",
}

export default function LayoutCreateRoom() {
    return <CreateRoom />
}
