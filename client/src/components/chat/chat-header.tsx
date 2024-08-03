import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useActiveChatName } from "@/hooks/chats/use-active-chat-name";
import { useActiveChat } from "@/hooks/global/use-active-chat";
import { useChatDetailsSheet } from "@/hooks/global/use-chat-details-sheet";
import { User } from "lucide-react";

interface ChatHeaderProps {}

export const ChatHeader: React.FC<ChatHeaderProps> = ({}) => {
	const { activeChat } = useActiveChat();
	const { currentUser } = useAuthUser();
	const { setOpen, open } = useChatDetailsSheet();
	const chatName = useActiveChatName();

	if (!activeChat) {
		return null;
	}

	return (
		<h1 className="flex items-center gap-2 p-5 font-medium text-primary">
			<User
				size={40}
				className="cursor-pointer rounded-full bg-primary p-2 text-primary-foreground"
				onClick={() => !open && setOpen(true)}
			/>
			{activeChat ? chatName : "ChatHeader"}
		</h1>
	);
};
