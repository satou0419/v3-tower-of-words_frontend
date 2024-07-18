import BASE_URL from "@/util/baseUrl";

interface Enemy {
    id: number;
    imagePath: string;
    words: SimulationWords[];
}

interface SimulationWords {
    word: string;
}

interface Room {
    roomID: number;
}

interface SimulationDetails {
    roomID: Room;
    simulationType: string;
    name: string;
    deadline: string;
    attackInterval: number;
    studentLife: number;
    numberOfAttempt: number;
    items: boolean;
    description: boolean;
    pronunciation: boolean;
    enemy: Enemy[];
}

const createGame = async (simulation: SimulationDetails) => {
    try {
        const response = await fetch(`${BASE_URL}/simulation/create_simulation`, {
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
        console.error("Error creating room:", error);
        throw error;
    }
};

export default createGame;