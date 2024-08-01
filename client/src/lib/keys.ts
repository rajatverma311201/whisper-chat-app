export const getCurrentUserKey = () => ["currentUser"];

export const getAllUsersKey = () => ["allUsers"];

export const getAllChatsKey = () => ["allChats"];

export const getPersonalChatsKey = () => ["personalChats"];

export const getGroupChatsKey = () => ["groupChats"];

export const getPersonalChatMessagesKey = (chatId: string) => [
	"personalChatMessages",
	chatId,
];

export const getGroupChatMessagesKey = (chatId: string) => [
	"groupChatMessages",
	chatId,
];

export const getChatMessagesKey = (chatId: string) => ["chatMessages", chatId];
