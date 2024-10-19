import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const removeUserFromRoom = async (userID: number, roomID: number) => {
    try {
        const response = await fetch(
            `${BASE_URL}/room/remove_user/${userID}/from_room_by/${roomID}`, // Adjusted URL format
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to remove user from room");
        }

        const data = await response.json();
        return data; // Assuming the server responds with JSON data
    } catch (error) {
        throw new Error("Failed to remove user from room");
    }
};

export default removeUserFromRoom;
