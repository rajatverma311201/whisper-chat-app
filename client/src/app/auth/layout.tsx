"use client";

import { PageLoader } from "@/components/page-loader";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
	const { currentUser, isLoadingCurrentUser, error } = useAuthUser();
	const router = useRouter();

	useEffect(() => {
		if (!isLoadingCurrentUser && currentUser) {
			router.replace("/");
		}
	}, [isLoadingCurrentUser, currentUser, router]);

	if (isLoadingCurrentUser || currentUser === undefined || currentUser) {
		return <PageLoader />;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return <div className="flex h-full justify-center pt-20">{children}</div>;
};
export default AuthLayout;
