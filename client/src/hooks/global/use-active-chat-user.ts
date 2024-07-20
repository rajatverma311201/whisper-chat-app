import { create } from "zustand";

interface ActiveChatUserState {
	chatUser: Record<any, any> | null;
	setChatUser: (ch: Record<any, any>) => void;
}

export const useActiveChatUser = create<ActiveChatUserState>()((set) => ({
	chatUser: null,
	setChatUser: (ch) => set({ chatUser: ch }),
}));
