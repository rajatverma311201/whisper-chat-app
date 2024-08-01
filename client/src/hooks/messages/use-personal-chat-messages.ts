"use client";
import { getPersonalChatMessagesKey } from "@/lib/keys";
import { getPersonalChatMessages } from "@/services/api-messages";
import { useQuery } from "@tanstack/react-query";

export const usePersonalChatMessages = (chatId: string) => {
	const {
		data: chatMessages,
		isLoading: isLoadingChatMessages,
		isFetching: isFetchingChatMessages,
		error,
	} = useQuery({
		queryKey: getPersonalChatMessagesKey(chatId),
		queryFn: () => getPersonalChatMessages(chatId),
	});

	return {
		chatMessages,
		isFetchingChatMessages,
		isLoadingChatMessages,
		error,
	};
};
