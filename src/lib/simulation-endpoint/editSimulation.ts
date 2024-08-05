import BASE_URL from "@/util/baseUrl";

interface Simulation {
    simulationID: number;
    name: string;
    deadline: string;
}

const editSimulation = async ({ simulationID, name, deadline }: Simulation) => {
    try {
        const response = await fetch(`${BASE_URL}/simulation/edit_simulation/simulation/${simulationID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, deadline }), // Assuming only the name is being updated
        });

        if (!response.ok) {
            throw new Error("Failed to edit simulation");
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error editing simulation:", error);
        throw error;
    }
};

export default editSimulation;