import BASE_URL from "@/util/baseUrl";

interface Room {
    name: string;
    creatorID: number;
}

export const createRoom = async (room: Room) => {
    try {
        const response = await fetch(`${BASE_URL}/room/create_room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(room),
        });
        if (!response.ok) {
            throw new Error("Failed to create room");
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error creating room:", error);
        throw error;
    }
};
