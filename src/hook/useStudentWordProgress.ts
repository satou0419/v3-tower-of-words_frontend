import { useState, useEffect } from "react";
import BASE_URL from "@/util/baseUrl";

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

const useStudentWordProgress = (simulationID: number, studentID: any, wordID: any) => {
    const [wordProgress, setWordProgress] = useState<SimulationProgress>({
        studentWordProgressID: 0,
        simulationWordsID: 0,
        studentID: 0,
        correct: false,
        score: 0,
        duration: 0,
        accuracy: 0,
        mistake: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchWordProgress = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/student_word_progress/view_one_by/student/${studentID}/simulation/${simulationID}/word/${wordID}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch word progress data for StudentID: ${studentID}, SimulationID: ${simulationID}, and WordID: ${wordID}`);
                }
                const data = await response.json();
                setWordProgress(data.data);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchWordProgress();
    }, [simulationID, studentID, wordID]);

    return { wordProgress, loading, error };
};

export default useStudentWordProgress;