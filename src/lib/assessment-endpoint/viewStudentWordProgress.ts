import BASE_URL from "@/util/baseUrl";

const viewStudentWordProgress = async (simulationID: number, studentID: number) => {
    try {
        const response = await fetch(
            `${BASE_URL}/student_word_progress/view_all_by/student/${studentID}/simulation/${simulationID}`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch word progress data for StudentID: ${studentID} and SimulationID: ${simulationID}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Failed to fetch word progress data:", error);
        throw error;
    }
};

export default viewStudentWordProgress;
