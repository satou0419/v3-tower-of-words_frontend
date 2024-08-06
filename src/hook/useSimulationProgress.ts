// hooks/useSimulationProgress.ts
import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";
import { useState, useEffect } from "react";

interface SimulationProgress {
    studentWordProgressID: number;
    simulationWordsID: number;
    studentID: number;
    correct: boolean;
    score: number;
    duration: number;
    accuracy: number;
    mistake: number;
}

interface UseSimulationProgressResult {
    data: SimulationProgress[] | null;
    loading: boolean;
    error: string | null;
}

const useSimulationProgress = (
    progressData: SimulationProgress
): UseSimulationProgressResult => {
    const { userID } = useAuthStore.getState();
    const [data, setData] = useState<SimulationProgress[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const updateSimulationProgress = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/student_word_progress/update`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(progressData),
                    }
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

        updateSimulationProgress();
    }, [userID, progressData]);

    return { data, loading, error };
};

export default useSimulationProgress;
