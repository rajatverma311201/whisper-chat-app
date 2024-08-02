import { create } from "zustand";

interface ChatDetailsSheetState {
	open: boolean;
	setOpen: (val: boolean) => void;
}

export const useChatDetailsSheet = create<ChatDetailsSheetState>()((set) => ({
	open: false,
	setOpen: (val) => set({ open: val }),
}));
