import BASE_URL from "@/util/baseUrl";

interface Room {
    roomID: number;
    name: string;
}

const renameRoom = async ({ roomID, name }: Room) => {
    try {
        const response = await fetch(`${BASE_URL}/room/rename`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomID, name }),
        });
        if (!response.ok) {
            throw new Error("Failed to rename room");
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error renaming room:", error);
        throw error;
    }
};

export default renameRoom;