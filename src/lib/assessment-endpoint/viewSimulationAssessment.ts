import BASE_URL from "@/util/baseUrl";

const viewSimulationAssessment = async (simulationID: number) => {
    try {
        const response = await fetch(
            `${BASE_URL}/simulation_assessment/view_by_simulation/${simulationID}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch simulation assessment for ID:" + simulationID);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Failed to fetch simulation assessment:", error);
        throw error;
    }
};

export default viewSimulationAssessment;
