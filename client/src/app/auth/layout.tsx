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

	return (
		<div className="flex min-h-screen flex-col items-center justify-center pt-5">
			{children}
		</div>
	);
};
export default AuthLayout;
