"use client";
import { PageLoader } from "@/components/page-loader";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { currentUser, isLoadingCurrentUser, isFetchingCurrentUser, error } =
        useAuthUser();
    const router = useRouter();
    console.log(currentUser);

    useEffect(() => {
        if (
            !isLoadingCurrentUser &&
            !isFetchingCurrentUser &&
            currentUser === null
        ) {
            router.replace("/auth");
        }
    }, [isLoadingCurrentUser, isFetchingCurrentUser, currentUser, router]);

    if (isLoadingCurrentUser || isFetchingCurrentUser || !currentUser) {
        return <PageLoader />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return <>{children}</>;
};

export default MainLayout;
