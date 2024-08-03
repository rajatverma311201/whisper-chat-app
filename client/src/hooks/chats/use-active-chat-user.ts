import { useAuthUser } from "../auth/use-auth-user";
import { useActiveChat } from "../global/use-active-chat";

export const useActiveChatUser = () => {
	const { activeChat } = useActiveChat();
	const { currentUser } = useAuthUser();

	if (!activeChat) {
		return null;
	}

	if (activeChat.isGroupChat) {
		return null;
	}
	const user =
		activeChat.chat.user1._id == currentUser?._id
			? activeChat.chat.user2
			: activeChat.chat.user1;

	return user;
};
