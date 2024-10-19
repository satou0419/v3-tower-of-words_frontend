import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const deleteRoom = async (roomID: number) => {
    const { userID } = useAuthStore.getState();

    try {
        const response = await fetch(`${BASE_URL}/room/remove/${roomID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID }),
        });

        if (!response.ok) {
            throw new Error("Failed to delete student room");
        }

        const data = await response.json();
        return data; // Assuming the server responds with some JSON data
    } catch (error) {
        throw new Error("Failed to delete student room");
    }
};

export default deleteRoom;
