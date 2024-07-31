import { getAllChatsKey } from "@/lib/keys";
import { createGroupChatWithUsers } from "@/services/api-chats";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface MutationFnArgs {
	name: string;
	userIds: string[];
}
interface CreateGroupChatWithUsersHookArgs {
	onSuccess?: () => void;
	onError?: () => void;
}
export const useCreateGroupChatWithUsers = ({
	onSuccess,
	onError,
}: CreateGroupChatWithUsersHookArgs) => {
	const queryClient = useQueryClient();

	const {
		mutate: createGroupChat,
		isPending: isLoading,
		error,
	} = useMutation({
		mutationFn: ({ name, userIds }: MutationFnArgs) => {
			return createGroupChatWithUsers(name, userIds);
		},

		onSuccess: (data) => {
			toast.dismiss();

			toast.success("Group created successfully");
			onSuccess?.();

			queryClient.invalidateQueries({ queryKey: getAllChatsKey() });
		},
		onError: (error: Error) => {
			toast.dismiss();
			onError?.();

			toast.error(error.message);
		},
	});

	return {
		createGroupChat,
		isLoading,
		error,
	};
};
