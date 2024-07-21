"use client";
import { sendPersonalMessageInChat } from "@/services/api-messages";
import { useMutation } from "@tanstack/react-query";
interface MutationFnArgs {
	chatId: string;
	message: string;
}

interface UseSendPersonalMessageArgs {
	onSuccess?: () => void;
}

export const useSendPersonalMessage = ({
	onSuccess,
}: UseSendPersonalMessageArgs) => {
	const {
		mutate: sendMessage,
		isPending: isSendingMessage,
		error,
	} = useMutation({
		mutationFn: ({ chatId, message }: MutationFnArgs) => {
			return sendPersonalMessageInChat(chatId, message);
		},
		onSuccess: (data) => {
			onSuccess?.();
		},
		onError: (error: Error) => {},
	});

	return {
		sendMessage,
		isSendingMessage,
		error,
	};
};
