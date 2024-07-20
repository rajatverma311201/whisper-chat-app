"use client";
import { getAllUsersKey } from "@/lib/keys";
import { getAllUsers } from "@/services/api-users";
import { useQuery } from "@tanstack/react-query";

export const useAllUsers = () => {
	const {
		data: users,
		isLoading: isLoadingUsers,
		isFetching: isFetchingUsers,
		error,
	} = useQuery({
		queryKey: getAllUsersKey(),
		queryFn: getAllUsers,
	});

	return {
		users,
		isFetchingUsers,
		isLoadingUsers,
		error,
	};
};
