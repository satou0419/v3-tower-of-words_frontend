import BASE_URL from "@/util/baseUrl";
import { useState, useEffect } from "react";

const useCheckUsername = (username: string) => {
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<
        boolean | null
    >(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!username) {
            setIsUsernameAvailable(null);
            return;
        }

        const checkUsername = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${BASE_URL}/user/checkExist/${username}`
                );
                const result = await response.json();

                if (response.ok && result.status === "OK") {
                    setIsUsernameAvailable(!result.data); // If `data` is `true`, username exists
                } else {
                    setIsUsernameAvailable(false);
                }
            } catch (error) {
                console.error("Error checking username:", error);
                setIsUsernameAvailable(false);
            } finally {
                setLoading(false);
            }
        };

        checkUsername();
    }, [username]);

    return { isUsernameAvailable, loading };
};

export default useCheckUsername;
