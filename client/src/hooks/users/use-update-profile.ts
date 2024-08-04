"use client";
import {} from "@/services/api-messages";
import { updateUserProfileDetails } from "@/services/api-users";
import { useMutation } from "@tanstack/react-query";

interface MutationFnArgs extends Record<any, any> {}

export const useUpdateProfile = () => {
	const {
		mutate: updateProfile,
		isPending: isUpdatingProfile,
		error,
	} = useMutation({
		mutationFn: (data: MutationFnArgs) => {
			return updateUserProfileDetails(data);
		},
		onSuccess: () => {},
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
