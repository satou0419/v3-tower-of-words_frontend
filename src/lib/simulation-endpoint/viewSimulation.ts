import BASE_URL from "@/util/baseUrl";

interface Enemy {
    imagePath: string;
    words: number[];
}

interface SimulationParticipant {
    simulationParticipantsID: number;
    userID: number;
    score: number;
    duration: string | null;
    attempts: number;
    accuracy: number;
    wordsProgress: any[];
    done: boolean;
}

interface SimulationAssessment {
    simulationWordAssessmentID: number;
    simulationID: number;
    simulationEnemyID: number;
    simulationWordID: number;
    accuracy: number;
    attempts: number;
    score: number;
    duration: number;
}

interface SimulationDetails {
    simulationID: number;
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
    participants: SimulationParticipant[];
    assessment: SimulationAssessment[];
}

export const viewSimulation  = async (simulationID: number): Promise<SimulationDetails> => {
    try {
        console.log(simulationID)
        const response = await fetch(
            `${BASE_URL}/simulation/simulation_details/${simulationID}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch room details");
        }
        const data = await response.json();
        console.log(data);
        return data.data;
    } catch (error) {
        console.error("Error fetching room details:", error);
        throw error;
    }
};
