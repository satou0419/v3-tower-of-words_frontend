// components/withAuth.tsx
import React, { ComponentType } from "react";
import useAuth from "@/util/useAuth";

const withAuth = (WrappedComponent: ComponentType, requiredRole?: string) => {
    const WithAuthComponent: React.FC = (props) => {
        const { isLoggedIn, userType, authChecked } = useAuth(requiredRole);

        // if (!authChecked) {
        //     // Show loading spinner while checking authentication status
        //     return <div>Loading...</div>;
        // }

        if (!isLoggedIn) {
            // Optionally, redirect to login or show an unauthorized message
            return <div>Unauthorized. Redirecting to homepage...</div>;
        }

        if (requiredRole && userType !== requiredRole) {
            // Optionally, redirect to dashboard or show an unauthorized message
            return <div>Unauthorized. Redirecting to dashboard...</div>;
        }

        return <WrappedComponent {...props} />;
    };

    return WithAuthComponent;
};

export default withAuth;
