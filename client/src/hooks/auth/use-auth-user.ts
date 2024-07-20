"use client";
import { getCurrentUserKey } from "@/lib/keys";
import { getMyDetails } from "@/services/apiAuth";
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
	const {
		data: currentUser,
		isLoading: isLoadingCurrentUser,
		isFetching: isFetchingCurrentUser,
		error,
	} = useQuery({
		queryKey: getCurrentUserKey(),
		queryFn: getMyDetails,
	});

	return {
		currentUser,
		isFetchingCurrentUser,
		isLoadingCurrentUser,
		error,
	};
};
