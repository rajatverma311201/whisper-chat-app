import { Fetch } from "@/lib/Fetch";

export const sendPersonalMessageInChat = async (
	chatId: string,
	message: string,
) => {
	const url = "api/personal-messages";
	const data = await Fetch.POST(url, { message, chatId });
	return data.data;
};

export const getChatMessages = async (chatId: string) => {
	const url = `api/personal-chats/${chatId}/messages`;
	const data = await Fetch.GET(url);
	return data.data;
};

export const updateMessageStatusToRead = async (msgId: string) => {
	const url = `api/personal-messages/${msgId}/read`;
	const data = await Fetch.PATCH(url, {});
	return data.data;
};
