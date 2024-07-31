import { create } from "zustand";

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

interface SimulationState {
    simulations: SimulationDetails[];
    currentSimulation: SimulationDetails;
    setSimulation: (simulations: SimulationDetails[]) => void;
    setCurrentSimulation: (simulation: SimulationDetails) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
    simulations: [],
    currentSimulation: {
        simulationID: 0,
        simulationType: "",
        name: "",
        deadline: "",
        attackInterval: 0,
        studentLife: 0,
        numberOfAttempt: 0,
        items: false,
        description: false,
        pronunciation: false,
        enemy: [],
        participants: [],
        assessment: [],
    },
    setSimulation: (simulations) => set({ simulations }),
    setCurrentSimulation: (simulation) => set({ currentSimulation: simulation }),
}));
