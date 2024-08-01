"use client";
import { useActiveChat } from "@/hooks/global/use-active-chat";
import {
	sendGroupMessageInChat,
	sendPersonalMessageInChat,
} from "@/services/api-messages";
import { useMutation } from "@tanstack/react-query";

interface MutationFnArgs {
	chatId: string;
	message: string;
}

interface UseSendMessageArgs {
	onSuccess?: () => void;
}

export const useSendMessage = ({ onSuccess }: UseSendMessageArgs) => {
	const { activeChat } = useActiveChat();

	const {
		mutate: sendMessage,
		isPending: isSendingMessage,
		error,
	} = useMutation({
		mutationFn: ({ chatId, message }: MutationFnArgs) => {
			if (activeChat?.isGroupChat) {
				return sendGroupMessageInChat(chatId, message);
			} else {
				return sendPersonalMessageInChat(chatId, message);
			}
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
