import BASE_URL from "@/util/baseUrl";

const viewStudentSimulations = async (studentID: number) => {
    try {
        const response = await fetch(
            `${BASE_URL}/simulation/student_simulations/${studentID}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch student simulations for ID: " + studentID);
        }
        const data = await response.json();
        return data.data; // Assuming data contains the 'data' key from your JSON
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to fetch student simulations for ID: " + studentID);
    }
};

export default viewStudentSimulations;