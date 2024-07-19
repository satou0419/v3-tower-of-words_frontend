import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const useAddWord = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { userID } = useAuthStore.getState();

    const addWord = async (word: string) => {
        setIsLoading(true);
        setError(null); // Clear previous errors

        try {
            const response = await fetch(
                `${BASE_URL}/archive_words/insert/${userID}/${encodeURIComponent(
                    word
                )}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        checked: true,
                        deleted: false,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Word archived successfully:", data);
        } catch (error: any) {
            setError(error.message || "Error archiving word.");
            console.error("Error archiving word:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { addWord, isLoading, error };
};

export default useAddWord;
