"use client";
import { sendPersonalMessageInChat } from "@/services/api-messages";
import { useMutation } from "@tanstack/react-query";
interface MutationFnArgs {
	chatId: string;
	message: string;
}

export const useSendPersonalMessage = () => {
	const {
		mutate: sendMessage,
		isPending: isSendingMessage,
		error,
	} = useMutation({
		mutationFn: ({ chatId, message }: MutationFnArgs) => {
			return sendPersonalMessageInChat(chatId, message);
		},
		onSuccess: (data) => {},
		onError: (error: Error) => {},
	});

	return {
		sendMessage,
		isSendingMessage,
		error,
	};
};
