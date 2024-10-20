import BASE_URL from "@/util/baseUrl";

interface StudentInfo {
    userDetailsID: number | null;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    userType: string;
}

const getStudentInfo = async (
    studentID: number
): Promise<StudentInfo | null> => {
    try {
        const response = await fetch(
            `${BASE_URL}/user/get_user_info/${studentID}`
        );

        // Check if the response is not OK
        if (!response.ok) {
            console.error(`Failed to fetch student info for ID: ${studentID}`);
            return null; // Return null on error instead of throwing
        }

        const data = await response.json();
        console.log(data.data); // Log the fetched data for debugging
        return data.data; // Assuming the API returns StudentInfo directly
    } catch (error) {
        console.error(
            `Error fetching student info for ID ${studentID}:`,
            error
        );
        return null; // Return null in case of unexpected error
    }
};

export default getStudentInfo;
