import { useState, useEffect } from "react";
import BASE_URL from "@/util/baseUrl";

interface StudentInfo {
    userDetailsID: number | null;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    userType: string;
}

interface StudentInfoResult {
    data: StudentInfo;
    loading: boolean;
    error: string | null;
}

const useStudentInfo = (studentID: number) => {
    const [studentInfo, setStudentInfo] = useState<StudentInfoResult>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/user/get_user_info/${studentID}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch user info");
                }

                const data = await response.json();
                console.log(data)
                setStudentInfo(data);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentInfo();
    }, [studentID]);

    return { studentInfo, loading, error };
};

export default useStudentInfo;
