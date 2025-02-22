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
	chat: Record<any, any>,
	currentUser: User,
) => {
	const users = [chat.user1, chat.user2];
	return users.find((user) => user._id !== currentUser._id);
};
