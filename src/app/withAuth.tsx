// components/withAuth.tsx
import useAuth from "@/util/useAuth";
import React, { ComponentType } from "react";

const withAuth = (WrappedComponent: ComponentType, requiredRole?: string) => {
    const WithAuthComponent: React.FC = (props) => {
        const { isLoggedIn, userType } = useAuth(requiredRole);

        if (isLoggedIn === undefined || userType === undefined) {
            return <div>Loading...</div>;
        }

        if (!isLoggedIn || (requiredRole && userType !== requiredRole)) {
            return <div>Unauthorized</div>;
        }

        return <WrappedComponent {...props} />;
    };

    return WithAuthComponent;
};

export default withAuth;
