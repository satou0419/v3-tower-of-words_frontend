import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const viewStudentRoom = async () => {
    const { userID } = useAuthStore.getState();

    try {
        const response = await fetch(
            `${BASE_URL}/room/student_rooms/${userID}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch student room");
        }
        const data = await response.json();
        return data.data; // Assuming data contains the 'data' key from your JSON
    } catch (error) {
        throw new Error("Failed to fetch student room");
    }
};

export default viewStudentRoom;
