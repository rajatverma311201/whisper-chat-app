import { Input } from "@/components/ui/input";
import { useActiveChat } from "@/hooks/global/use-active-chat";
import { useSendMessage } from "@/hooks/messages/use-send-message";
import {
	getGroupChatMessagesKey,
	getPersonalChatMessagesKey,
} from "@/lib/keys";
import { useQueryClient } from "@tanstack/react-query";
import { Mic, Plus, Smile } from "lucide-react";
import { FormEvent, useState } from "react";

interface ChatFooterProps {}

export const ChatFooter: React.FC<ChatFooterProps> = ({}) => {
	const { activeChat } = useActiveChat((state) => state);

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

	return (
		<div className="flex items-center gap-5 p-4">
			<Smile className="stroke-[2.5px]" size={30} />
			<Plus className="stroke-[2.5px]" size={30} />
			<form onSubmit={handleSendMessage} autoFocus className="flex-1">
				<Input
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
			</form>
			<Mic className="stroke-[2.5px]" size={30} />
		</div>
	);
};
