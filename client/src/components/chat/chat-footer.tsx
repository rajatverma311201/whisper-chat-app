import { Input } from "@/components/ui/input";
import { useActiveChat } from "@/hooks/global/use-active-chat";
import { useSocket } from "@/hooks/global/use-socket";
import { useSendMessage } from "@/hooks/messages/use-send-message";
import { SocketConst } from "@/lib/constants";
import {
	getGroupChatMessagesKey,
	getPersonalChatMessagesKey,
} from "@/lib/keys";
import { useQueryClient } from "@tanstack/react-query";
import { Mic, Plus, Smile } from "lucide-react";
import { FormEvent, use, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

interface ChatFooterProps {}

export const ChatFooter: React.FC<ChatFooterProps> = ({}) => {
	const { activeChat } = useActiveChat((state) => state);
	const { socket } = useSocket();
	const typingRef = useRef<boolean>(false);

	const queryClient = useQueryClient();
	const { sendMessage } = useSendMessage({
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: activeChat?.isGroupChat
					? getGroupChatMessagesKey(activeChat?.chat._id || "")
					: getPersonalChatMessagesKey(activeChat?.chat._id || ""),
			});
			setMessage("");
		},
	});
	// const {}
	const [message, setMessage] = useState("");

	const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const chatId = activeChat?.chat._id;

		if (!chatId) {
			return;
		}

		sendMessage({
			chatId,
			message: message.trim(),
		});
	};

	const handleTyping = () => {
		if (typingRef.current) {
			return;
		}
		console.log("typing");
		if (!activeChat?.chat._id) {
			return;
		}
		if (activeChat?.isGroupChat) {
			return;
		}

		console.log("typing");

		socket.emit(SocketConst.PERSONAL_CHAT_TYPING, {
			chatId: activeChat?.chat._id,
			activeChat,
		});

		typingRef.current = true;
	};

	const handleStopTyping = () => {
		if (!activeChat?.chat._id) {
			return;
		}
		if (activeChat?.isGroupChat) {
			return;
		}
		console.log("typing-stop");

		socket.emit(SocketConst.PERSONAL_CHAT_STOP_TYPING, {
			chatId: activeChat?.chat._id,
			activeChat,
		});

		typingRef.current = false;
	};

	return (
		<div className="flex items-center gap-5 p-4">
			<Smile className="stroke-[2.5px]" size={30} />
			<Plus className="stroke-[2.5px]" size={30} />
			<form onSubmit={handleSendMessage} autoFocus className="flex-1">
				<Input
					value={message}
					onBlur={handleStopTyping}
					placeholder="Type a message"
					onChange={(e) => {
						setMessage(e.target.value);
						handleTyping();
					}}
				/>
			</form>
			<Mic className="stroke-[2.5px]" size={30} />
		</div>
	);
};
