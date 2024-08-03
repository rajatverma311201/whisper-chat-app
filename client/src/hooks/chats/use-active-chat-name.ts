import { useAuthUser } from "../auth/use-auth-user";
import { useActiveChat } from "../global/use-active-chat";

export const useActiveChatName = () => {
	const { activeChat } = useActiveChat();
	const { currentUser } = useAuthUser();

	if (!activeChat) {
		return null;
	}

	let chatName;
	if (activeChat.isGroupChat) {
		chatName = activeChat.chat.name;
	} else {
		chatName =
			activeChat.chat.user1._id == currentUser?._id
				? activeChat.chat.user2.name
				: activeChat.chat.user1.name;
	}

	return chatName;
};
