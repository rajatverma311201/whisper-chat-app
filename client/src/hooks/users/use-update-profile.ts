"use client";
import { getCurrentUserKey } from "@/lib/keys";
import { updateUserProfileDetails } from "@/services/api-users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
			toast.success("Profile updated successfully");
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
