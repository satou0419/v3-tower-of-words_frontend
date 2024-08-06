import BASE_URL from "@/util/baseUrl";

const getAllCharacters = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/character/get_all_characters`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch characters");
        }
        const { data: charactersData } = await response.json();
        return charactersData;
    } catch (error) {
        console.error("Error fetching all characters:", error);
        return [];
    }
};

export default getAllCharacters;
