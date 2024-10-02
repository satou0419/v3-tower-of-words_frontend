import { useState, useEffect } from "react";
import BASE_URL from "@/util/baseUrl";

const useGetUserDetails = (userID: number) => {
    const [userDetails, setUserDetails] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/user_details/get_user_detail?userID=${userID}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch user details");
                }

                const data = await response.json();
                setUserDetails(data.data); // Set the fetched user details
            } catch (err) {
                setError("Failed to get details");
            } finally {
                setLoading(false); // Ensure loading is set to false after completion
            }
        };

        if (userID) {
            fetchUserDetails();
        }
    }, [userID]);

    return { userDetails, error, loading };
};

export default useGetUserDetails;
