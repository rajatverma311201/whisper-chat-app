"use client";

import { PageLoader } from "@/components/page-loader";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
	const { currentUser, isLoadingCurrentUser, isFetchingCurrentUser, error } =
		useAuthUser();
	const router = useRouter();
	console.log(currentUser);

	useEffect(() => {
		if (!isLoadingCurrentUser && !isFetchingCurrentUser && currentUser) {
			router.replace("/");
		}
	}, [isLoadingCurrentUser, isFetchingCurrentUser, currentUser, router]);

	if (
		isLoadingCurrentUser ||
		isFetchingCurrentUser ||
		currentUser === undefined ||
		currentUser
	) {
		return <PageLoader />;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return <div className="flex h-full justify-center pt-20">{children}</div>;
};
export default AuthLayout;
