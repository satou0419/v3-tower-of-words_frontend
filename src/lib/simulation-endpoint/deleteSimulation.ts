import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";

const deleteSimulation = async (simulationID: number) => {
    const { userID } = useAuthStore.getState(); // Retrieve the userID

    try {
        const response = await fetch(
            `${BASE_URL}/simulation/remove/${simulationID}`, // Update to match the simulation delete URL
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userID }), // Send userID in the request body
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete simulation");
        }

        const data = await response.json();
        return data; // Assuming the server responds with JSON data
    } catch (error) {
        throw new Error("Failed to delete simulation");
    }
};

export default deleteSimulation;
