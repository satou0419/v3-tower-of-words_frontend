import BASE_URL from "@/util/baseUrl";

const updateGameAssessment = async (simulationID: number) => {
    try {
        const response = await fetch(`${BASE_URL}/simulation_assessment/update_simulation_assessment_average/simulation/${simulationID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to update simulation assessment");
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error updating simulation assessment:", error);
        throw error;
    }
};

export default updateGameAssessment;
