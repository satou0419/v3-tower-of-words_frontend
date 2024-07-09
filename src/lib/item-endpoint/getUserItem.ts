import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const getUserItem = async () => {
    const { userID } = useAuthStore.getState();

    try {
        const response = await fetch(
            `${BASE_URL}/user_item/get_user_items_by/${userID}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch items");
        }
        const { data } = await response.json();
    } catch (error) {
        console.error("Error fetching items:", error);
        return []; // Return an empty array or handle the error as needed
    }
};
