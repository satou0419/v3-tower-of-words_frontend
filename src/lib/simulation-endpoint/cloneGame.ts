import BASE_URL from "@/util/baseUrl";

const cloneGame = async (simulation: number, room: number) => {
    try {
        const response = await fetch(`${BASE_URL}/simulation/clone_simulation/simulation/${simulation}/room/${room}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(simulation),
        });
        if (!response.ok) {
            throw new Error("Failed to create simulation");
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error creating simulation:", error);
        throw error;
    }
};

export default cloneGame;