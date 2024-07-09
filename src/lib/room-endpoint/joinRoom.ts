import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const joinRoom = async (code: string) => {
    const { userID } = useAuthStore.getState();

    try {
        const response = await fetch(
            `${BASE_URL}/room/${code}/join_room/${userID}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to join room");
        }
        const data = await response.json();
        console.log("Join Room:", data);
        return data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export default joinRoom;
