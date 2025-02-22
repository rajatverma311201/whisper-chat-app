"use client";
import { getCurrentUserKey } from "@/lib/keys";
import { updateUserProfileDetails } from "@/services/api-users";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface MutationFnArgs extends Record<any, any> {}

export const useUpdateProfile = () => {
	const queryClient = useQueryClient();

	const {
		mutate: updateProfile,
		isPending: isUpdatingProfile,
		error,
	} = useMutation({
		mutationFn: (data: MutationFnArgs) => {
			return updateUserProfileDetails(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getCurrentUserKey() });
		},
		onError: (error: Error) => {
			console.error(error);
		},
	});

	return {
		updateProfile,
		isUpdatingProfile,
		error,
	};
};
