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

const updateSimulationProgress = async (progressData: SimulationProgress) => {
    try {
        const response = await fetch(
            `${BASE_URL}/student_word_progress/edit/wordProgress/${progressData?.studentWordProgressID}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(progressData),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to edit simulation");
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error editing simulation:", error);
        throw error;
    }
};

export default updateSimulationProgress;
