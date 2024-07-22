"use client";
import { PageLoader } from "@/components/page-loader";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	const { currentUser, isLoadingCurrentUser, error } = useAuthUser();
	const router = useRouter();

	useEffect(() => {
		if (!isLoadingCurrentUser && currentUser === null) {
			router.replace("/auth");
		}
	}, [isLoadingCurrentUser, currentUser, router]);

	if (isLoadingCurrentUser || !currentUser) {
		return <PageLoader />;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return <>{children}</>;
};

export default MainLayout;
