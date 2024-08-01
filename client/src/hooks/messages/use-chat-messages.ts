"use client";
import {
	getGroupChatMessagesKey,
	getPersonalChatMessagesKey,
} from "@/lib/keys";
import {
	getGroupChatMessages,
	getPersonalChatMessages,
} from "@/services/api-messages";
import { useQuery } from "@tanstack/react-query";
import { useActiveChat } from "../global/use-active-chat";

export const useChatMessages = (chatId: string) => {
	const { activeChat } = useActiveChat();

	const {
		data: chatMessages,
		isLoading: isLoadingChatMessages,
		isFetching: isFetchingChatMessages,
		error,
	} = useQuery({
		queryKey: activeChat?.isGroupChat
			? getGroupChatMessagesKey(chatId)
			: getPersonalChatMessagesKey(chatId),
		queryFn: () =>
			activeChat?.isGroupChat
				? getGroupChatMessages(chatId)
				: getPersonalChatMessages(chatId),
	});

	return {
		chatMessages,
		isFetchingChatMessages,
		isLoadingChatMessages,
		error,
	};
};
