import { create } from "zustand";

interface ActiveChatState {
	activeChat: { isGroupChat: boolean; chat: Record<any, any> } | null;
	setActiveChat: (ch: {
		isGroupChat: boolean;
		chat: Record<any, any>;
	}) => void;
}

export const useActiveChat = create<ActiveChatState>()((set) => ({
	activeChat: null,
	setActiveChat: (ch) => set({ activeChat: ch }),
}));
