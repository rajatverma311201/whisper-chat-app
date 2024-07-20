import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useActiveChat } from "@/hooks/global/use-active-chat";

interface ChatHeaderProps {}

export const ChatHeader: React.FC<ChatHeaderProps> = ({}) => {
	const { activeChat } = useActiveChat();
	const { currentUser } = useAuthUser();
	console.log({ activeChat });

	const chatName =
		activeChat?.user1._id == currentUser?._id
			? activeChat?.user2.name
			: activeChat?.user1.name;

	return <h1 className="p-5">{activeChat ? chatName : "ChatHeader"}</h1>;
};
