import { create } from "zustand";

interface ActiveChatState {
	activeChat: Record<any, any> | null;
	setActiveChat: (ch: Record<any, any>) => void;
}

export const useActiveChat = create<ActiveChatState>()((set) => ({
	activeChat: null,
	setActiveChat: (ch) => set({ activeChat: ch }),
}));
