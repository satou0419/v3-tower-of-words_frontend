// hooks/useAuth.ts
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUserInfoStore from "../store/userInfoStore";
import { useAuthStore } from "@/store/authStore";

const useAuth = (requiredRole?: string) => {
    const router = useRouter();
    const { userType } = useUserInfoStore();
    const { isLoggedIn } = useAuthStore();

    useEffect(() => {
        if (!isLoggedIn || (requiredRole && userType !== requiredRole)) {
            setTimeout(() => {
                router.replace("/dashboard");
            }, 3000);
        }
    }, [isLoggedIn, userType, requiredRole, router]);

    return { isLoggedIn, userType };
};

export default useAuth;
