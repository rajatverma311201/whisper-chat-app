import { Fetch } from "@/lib/Fetch";

export const createChatWithUser = async (
	userId: string,
): Promise<Record<any, any>> => {
	const url = "api/personal-chats";
	const data = await Fetch.POST(url, { userId });
	return data.data;
};

export const getAllMyPersonalChats = async (): Promise<Record<any, any>> => {
	const url = "api/personal-chats";
	const data = await Fetch.GET(url);
	return data.data;
};
