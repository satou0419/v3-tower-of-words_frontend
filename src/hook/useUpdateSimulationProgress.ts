import { useAuthStore } from "@/store/authStore";
import BASE_URL from "@/util/baseUrl";
import { useState, useCallback } from "react";

interface SimulationProgressInput {
    studentWordProgressID: number;
    simulationWordsID: number;
    studentID: number;
    numberOfAttempts: number;
    isCorrect: boolean;
    score: number;
    duration: number;
    accuracy: number;
}

interface UseUpdateSimulationProgressResult {
    updateProgress: (progress: SimulationProgressInput) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const { userID } = useAuthStore.getState();

const useUpdateSimulationProgress = (
    simulationAttemptID: number
): UseUpdateSimulationProgressResult => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateProgress = useCallback(
        async (progress: SimulationProgressInput) => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `${BASE_URL}/student_word_progress/edit/${simulationAttemptID}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...progress,
                            studentID: userID,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = await response.json();
                console.log("Update successful:", result);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        },
        [userID]
    );

    return { updateProgress, loading, error };
};

export default useUpdateSimulationProgress;
