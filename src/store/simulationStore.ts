import { create } from "zustand";

interface Enemy {
    id: number;
    imagePath: string;
    words: SimulationWords[];
}

interface SimulationWords {
    word: string;
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
}

interface SimulationState {
    simulations: SimulationDetails[];
    setSimulation: (simulations: SimulationDetails[]) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
    simulations: [],
    setSimulation: (simulations) => set({ simulations }),
}));