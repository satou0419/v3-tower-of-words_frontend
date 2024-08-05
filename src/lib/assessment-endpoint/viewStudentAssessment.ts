import BASE_URL from "@/util/baseUrl";

const viewStudentAssessment = async (simulationID: number, userID: number) => {
    try {
        const response = await fetch(
            `${BASE_URL}/simulations_participants/view_simulation_participant_by/user/${userID}/simulation/${simulationID}`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch simulation participant data for UserID: ${userID} and SimulationID: ${simulationID}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Failed to fetch simulation participant data:", error);
        throw error;
    }
};

export default viewStudentAssessment;
