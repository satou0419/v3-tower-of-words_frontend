// hooks/useAuth.ts
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useUserInfoStore from "../store/userInfoStore";
import { useAuthStore } from "@/store/authStore";

const useAuth = (requiredRole?: string) => {
    const router = useRouter();
    const { userType } = useUserInfoStore();
    const { isLoggedIn } = useAuthStore();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        if (isLoggedIn === undefined || userType === undefined) return;

        if (!isLoggedIn) {
            setTimeout(() => {
                router.replace("/login");
            }, 3000);
        } else if (requiredRole && userType !== requiredRole) {
            setTimeout(() => {
                router.replace("/dashboard");
            }, 3000);
        } else {
            setAuthChecked(true);
        }
    }, [isLoggedIn, userType, requiredRole, router]);

    return { isLoggedIn, userType, authChecked };
};

export default useAuth;
