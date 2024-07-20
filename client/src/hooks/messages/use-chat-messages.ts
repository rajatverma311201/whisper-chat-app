"use client";
import { getChatMessagesKey } from "@/lib/keys";
import { getChatMessages } from "@/services/api-messages";
import { useQuery } from "@tanstack/react-query";

export const useChatMessages = (chatId: string) => {
	const {
		data: chatMessages,
		isLoading: isLoadingChatMessages,
		isFetching: isFetchingChatMessages,
		error,
	} = useQuery({
		queryKey: getChatMessagesKey(chatId),
		queryFn: () => getChatMessages(chatId),
	});

	return {
		chatMessages,
		isFetchingChatMessages,
		isLoadingChatMessages,
		error,
	};
};
