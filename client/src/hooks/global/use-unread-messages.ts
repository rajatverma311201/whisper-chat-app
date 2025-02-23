import { create } from "zustand";

interface UnreadMessagesState {
	messages: Record<string, Record<any, any>[]>;
	onNewMsgReceived: ({
		msg,
		chatId,
	}: {
		msg: Record<any, any>;
		chatId: string;
	}) => void;
	getUnreadMessages: (chatId: string) => Record<any, any>[] | undefined;
	getUnreadMessagesCount: (chatId: string) => number;
	clearUnreadMessages: (chatId: string) => Record<any, any>[];
	clearAllUnreadMessages: () => void;
}

export const useUnreadMessages = create<UnreadMessagesState>()((set, get) => ({
	messages: {},
	onNewMsgReceived: ({ msg, chatId }) => {
		const { messages } = get();
		const currentMessages = messages[chatId] || [];

		set({
			messages: {
				...messages,
				[chatId]: [...currentMessages, msg],
			},
		});
	},

	getUnreadMessages: (chatId: string) => {
		const { messages } = get();
		return messages[chatId];
	},
	getUnreadMessagesCount: (chatId: string) => {
		const { messages } = get();
		return messages[chatId]?.length || 0;
	},
	clearUnreadMessages: (chatId: string) => {
		const { messages } = get();
		const currentMessages = messages[chatId] || [];

		delete messages[chatId];
		set({
			messages: {
				...messages,
			},
		});

		return currentMessages;
	},
	clearAllUnreadMessages: () => {
		set({
			messages: {},
		});
	},
}));
