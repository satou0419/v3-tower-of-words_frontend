import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const useTabManagement = (basePath: string, defaultTab: string) => {
    const router = useRouter();
    const pathname = usePathname();
    const pathSegments = pathname.split("/");

    const initialTab = pathSegments.length > 2 ? pathSegments[2] : defaultTab;
    const [activeTab, setActiveTab] = useState<string>(initialTab);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`${basePath}/${tab}`);
    };

    return {
        activeTab,
        handleTabChange,
    };
};

export default useTabManagement;
