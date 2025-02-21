import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useActiveChatName } from "@/hooks/chats/use-active-chat-name";
import { useActiveChat } from "@/hooks/global/use-active-chat";
import { useChatDetailsSheet } from "@/hooks/global/use-chat-details-sheet";
import { useSocket } from "@/hooks/global/use-socket";
import { SocketConst } from "@/lib/constants";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

interface ChatHeaderProps {}

export const ChatHeader: React.FC<ChatHeaderProps> = ({}) => {
	const { activeChat } = useActiveChat();
	const { currentUser } = useAuthUser();
	const { setOpen, open } = useChatDetailsSheet();
	const chatName = useActiveChatName();
	const { socket } = useSocket();

	const [isTyping, setIsTyping] = useState(false);

	useEffect(() => {
		if (!currentUser) {
			return;
		}
		if (!activeChat) {
			return;
		}
		if (activeChat?.isGroupChat) {
			return;
		}

		socket.on(SocketConst.PERSONAL_CHAT_TYPING, (data) => {
			if (data.chatId == activeChat.chat._id) {
				setIsTyping(true);
			}
		});

		socket.on(SocketConst.PERSONAL_CHAT_STOP_TYPING, (data) => {
			if (data.chatId == activeChat.chat._id) {
				setIsTyping(false);
			}
		});

		return () => {
			socket.off(SocketConst.PERSONAL_CHAT_TYPING);
			socket.off(SocketConst.PERSONAL_CHAT_STOP_TYPING);
		};
	}, [activeChat, currentUser, socket]);
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
			{isTyping && (
				<span className="ml-5 text-primary/75">Typing...</span>
			)}
		</h1>
	);
};
