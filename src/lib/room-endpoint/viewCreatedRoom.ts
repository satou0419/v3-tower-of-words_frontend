import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const viewCreatedRoom = async () => {
    const { userID } = useAuthStore.getState();

    try {
        const response = await fetch(
            `${BASE_URL}/room/view_created_rooms/${userID}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch created rooms");
        }
        const data = await response.json();
        return data.data; // Assuming data contains the 'data' key from your JSON
    } catch (error) {
        throw new Error("Failed to fetch created room");
    }
};

export default viewCreatedRoom;
