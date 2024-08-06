import { useState, useEffect } from "react";
import BASE_URL from "@/util/baseUrl";
import { useAuthStore } from "@/store/authStore";

interface SimulationProgress {
    studentWordProgressID: number;
    simulationWordsID: number;
    studentID: number;
    simulationID: number;
    mistake: number;
    score: number;
    duration: number;
    accuracy: number;
    correct: boolean;
}

interface UseViewStudentSimulationProgressResult {
    data: SimulationProgress[] | null;
    loading: boolean;
    error: string | null;
}

const useViewStudentSimulationProgress = (
    simulationID: number
): UseViewStudentSimulationProgressResult => {
    const { userID } = useAuthStore.getState();
    const [data, setData] = useState<SimulationProgress[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSimulationProgress = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${BASE_URL}/student_word_progress/view_all_by/student/${userID}/simulation/${simulationID}`
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

        if (userID && simulationID) {
            fetchSimulationProgress();
        }
    }, [userID, simulationID]);

    return { data, loading, error };
};

export default useViewStudentSimulationProgress;
