import BASE_URL from "@/util/baseUrl";

const viewOneStudentWordProgress = async (simulationID: number, studentID: number, wordID: number) => {
    try {
        const response = await fetch(
            `${BASE_URL}/student_word_progress/view_one_by/student/${studentID}/simulation/${simulationID}/word/${wordID}`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch word progress data for StudentID: ${studentID}, SimulationID: ${simulationID}, and WordID: ${wordID}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Failed to fetch word progress data:", error);
        throw error;
    }

};

export default viewOneStudentWordProgress;
