import BASE_URL from "@/util/baseUrl";

const useRemoveWordBank = () => {
    const removeWordBank = async (simulationWordID: number) => {
        try {
            const response = await fetch(
                `${BASE_URL}/simulation_words/remove/${simulationWordID}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to remove word from word bank");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error); // Use console.error for error logging
            throw error;
        }
    };

    return { removeWordBank };
};

export default useRemoveWordBank;
