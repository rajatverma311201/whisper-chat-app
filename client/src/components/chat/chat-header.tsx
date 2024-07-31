import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useActiveChat } from "@/hooks/global/use-active-chat";

interface ChatHeaderProps {}

export const ChatHeader: React.FC<ChatHeaderProps> = ({}) => {
	const { activeChat } = useActiveChat();
	const { currentUser } = useAuthUser();
	console.log({ activeChat });

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

	return <h1 className="p-5">{activeChat ? chatName : "ChatHeader"}</h1>;
};
