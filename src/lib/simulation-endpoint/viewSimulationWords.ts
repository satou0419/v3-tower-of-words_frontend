import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const viewSimulationWords = async () => {
    const { userID } = useAuthStore.getState();

    try {
        const response = await fetch(
            `${BASE_URL}/simulation_words/word_bank/${userID}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch student room");
        }
        const data = await response.json();
        console.log(data);
        return data.data; // Assuming data contains the 'data' key from your JSON
    } catch (error) {
        throw new Error("Failed to fetch student room");
    }
};

export default viewSimulationWords;