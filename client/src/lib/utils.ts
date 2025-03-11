import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const wait = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const getNameInitials = (name: string) => {
	const vals = name.split(" ");
	if (vals.length === 1) {
		return vals[0].charAt(0).toUpperCase();
	}
	return (vals[0].charAt(0) + vals[vals.length - 1].charAt(0)).toUpperCase();
};

export const getPersonalChatUser = (
	activeChat: { chat: Record<any, any>; isGroupChat: boolean } | null,
	currentUser: User,
): Nullable<User> => {
	if (!activeChat || activeChat.isGroupChat) {
		return null;
	}

	console.log({ activeChat });

	const users = [activeChat.chat.user1, activeChat.chat.user2];
	return users.find((user) => user._id !== currentUser._id);
};

export const checkScreenSharingTrack = (track: MediaStreamTrack) => {
	const label = track.label.toLowerCase();
	const arr = ["screen", "display", "window", "tab"];
	for (const val of arr) {
		if (label.includes(val)) {
			return true;
		}
	}
	return false;
};
