import useUserInfoStore from "@/store/userInfoStore";
import BASE_URL from "@/util/baseUrl";
import { useState } from "react";

const useIncrementFloor = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const userDetailsID = useUserInfoStore((state) => state.userDetailsID);

    const incrementFloor = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(
                `${BASE_URL}/user_details/increment_floor?userDetailsID=${userDetailsID}`,
                {
                    method: "POST", // Assuming this is a POST request, adjust if it's GET or another method
                }
            );

            if (!response.ok) {
                throw new Error("Failed to increment floor");
            }

            const result = await response.json();
            setSuccess(true);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return { incrementFloor, loading, error, success };
};

export default useIncrementFloor;
