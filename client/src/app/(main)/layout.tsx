"use client";
import { PageLoader } from "@/components/page-loader";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useSocket } from "@/hooks/global/use-socket";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	const { currentUser, isLoadingCurrentUser, error } = useAuthUser();
	const router = useRouter();
	const { initSocket } = useSocket();

	useEffect(() => {
		if (!isLoadingCurrentUser && currentUser === null) {
			router.replace("/auth");
			return;
		}
		if (currentUser) {
			initSocket(currentUser?._id);
		}
	}, [isLoadingCurrentUser, currentUser, router, initSocket]);

	if (isLoadingCurrentUser || !currentUser) {
		return <PageLoader />;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return <>{children}</>;
};

export default MainLayout;
