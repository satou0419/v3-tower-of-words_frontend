import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const useAddWordBank = () => {
    const { userID } = useAuthStore.getState();

    const addWordBank = async (word: string) => {
        try {
            const response = await fetch(
                `${BASE_URL}/simulation_words/insert`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        creatorID: userID,
                        word: word,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add word to word bank");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    return { addWordBank };
};

export default useAddWordBank;
