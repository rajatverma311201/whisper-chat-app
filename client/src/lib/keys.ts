export const getCurrentUserKey = () => ["currentUser"];

export const getAllUsersKey = () => ["allUsers"];

export const getAllChatsKey = () => ["allChats"];

export const getPersonalChatsKey = () => ["personalChats"];

export const getChatMessagesKey = (chatId: string) => ["chatMessages", chatId];
