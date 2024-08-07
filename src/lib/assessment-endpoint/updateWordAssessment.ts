import BASE_URL from "@/util/baseUrl";

const updateWordAssessment = async (simulationID: number) => {
    try {
        // Construct the new URL with the simulationID
        const response = await fetch(`${BASE_URL}/simulations_word_assessment/update_assessment_average/${simulationID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to update word assessment");
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error updating word assessment:", error);
        throw error;
    }
};

export default updateWordAssessment;
