import { useState, useEffect } from "react";
import BASE_URL from "@/util/baseUrl";

// Interfaces
interface SimulationWordsArray {
    simulationWordsID: number;
    creatorID: number;
    word: string;
    silentIndex: string;
}

interface SimulationEnemy {
    simulationEnemyID: number;
    imagePath: string;
    words: SimulationWordsArray[];
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
    enemy: SimulationEnemy[];
    participants: SimulationParticipant[];
    assessment: SimulationAssessment[];
}

// Custom hook
const useSimulationDetails = (simulationID: number) => {
    const [simulationDetails, setSimulationDetails] =
        useState<SimulationDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSimulationDetails = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/simulation/simulation_details/${simulationID}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch simulation details");
                }
                const data = await response.json();
                setSimulationDetails(data.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSimulationDetails();
    }, [simulationID]);

    return { simulationDetails, loading, error };
};

export default useSimulationDetails;
