// hooks/useSimulationProgress.ts
import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";
import { useState, useEffect } from "react";

interface SimulationProgress {
    studentWordProgressID: number;
    simulationWordsID: number;
    studentID: number;
    numberOfAttempts: number;
    score: number;
    duration: number;
    accuracy: number;
    correct: boolean;
}

interface UseSimulationProgressResult {
    data: SimulationProgress[] | null;
    loading: boolean;
    error: string | null;
}

const useSimulationProgress = (): UseSimulationProgressResult => {
    const { userID } = useAuthStore.getState();
    const [data, setData] = useState<SimulationProgress[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSimulationProgress = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/student_word_progress/view_all_by/1`
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                setData(result.data);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchSimulationProgress();
    }, [userID]);

    return { data, loading, error };
};

export default useSimulationProgress;
