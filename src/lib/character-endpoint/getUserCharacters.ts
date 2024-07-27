import BASE_URL from "@/util/baseUrl";
import { useAuthStore } from "@/store/authStore";

const getUserCharacters = async () => {
    const { userID } = useAuthStore.getState();

    try {
        const response = await fetch(
            `${BASE_URL}/user_character/get_user_characters_by/${userID}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch user characters");
        }
        const { data: userCharactersData } = await response.json();
        return userCharactersData;
    } catch (error) {
        console.error("Error fetching user characters:", error);
        return [];
    }
};

export default getUserCharacters;
