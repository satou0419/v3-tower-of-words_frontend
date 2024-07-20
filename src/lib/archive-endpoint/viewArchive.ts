import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const viewArchive = async () => {
    const { userID } = useAuthStore.getState();

    try {
        const response = await fetch(
            `${BASE_URL}/archive_words/view/${userID}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        throw new Error("Failed to fetch word archive");
    }
};

export default viewArchive;
