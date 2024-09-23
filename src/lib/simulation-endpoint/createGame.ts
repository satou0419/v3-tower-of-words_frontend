import BASE_URL from "@/util/baseUrl";

interface Enemy {
    imagePath: string;
    words: number[];
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
    items: boolean;
    description: boolean;
    pronunciation: boolean;
    enemy: Enemy[];
}

const createGame = async (simulation: SimulationDetails) => {
    console.log(simulation)

    const filteredEnemies = simulation.enemy.map((enemy) => ({
        imagePath: enemy.imagePath,
        words: enemy.words,
    }));

    const filteredSimulation: SimulationDetails = {
        roomID: simulation.roomID,
        simulationType: simulation.simulationType,
        name: simulation.name,
        deadline: simulation.deadline,
        attackInterval: simulation.attackInterval,
        studentLife: simulation.studentLife,
        items: simulation.items,
        description: simulation.description,
        pronunciation: simulation.pronunciation,
        enemy: filteredEnemies,
    };


    console.log(filteredSimulation)

    try {
        const response = await fetch(`${BASE_URL}/simulation/create_simulation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(filteredSimulation),
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

export default createGame;