import BASE_URL from "@/util/baseUrl";

const updateParticipantAssessment = async (userID: number, simulationID: number) => {
    try {
        const response = await fetch(`${BASE_URL}/simulations_participants/update_average/user/${userID}/simulation/${simulationID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to update participant assessment");
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error updating participant assessment:", error);
        throw error;
    }
};

export default updateParticipantAssessment;
