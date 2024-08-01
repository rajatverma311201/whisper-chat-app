import { useActiveChat } from "@/hooks/global/use-active-chat";
import { useChatMessages } from "@/hooks/messages/use-chat-messages";
import { useEffect, useRef } from "react";
import { GroupMessageView } from "../group/group-message-view";
import { PersonalMessageView } from "./personal-message-view";

interface ChatContentProps {}

export const ChatContent: React.FC<ChatContentProps> = ({}) => {
	const { activeChat } = useActiveChat();

	if (!activeChat) {
		return (
			<div className="flex-1 overflow-y-auto bg-gray-50">
				<div className="grid h-full place-content-center">
					<h1 className="text-center text-2xl">No chat selected</h1>
				</div>
			</div>
		);
	}

	// if (activeChat.isGroupChat) {
	// 	return (
	// 		<div className="flex-1 overflow-y-auto bg-gray-50">
	// 			{activeChat.chat.name}
	// 		</div>
	// 	);
	// }
	return (
		<div className="flex-1 overflow-y-auto bg-gray-50">
			<ChatContentSection
				activeChatId={activeChat.chat._id}
				isGroupChat={activeChat.isGroupChat}
			/>
		</div>
	);
};

interface ChatContentSectionProps {
	activeChatId: string;
	isGroupChat?: boolean;
}

export const ChatContentSection: React.FC<ChatContentSectionProps> = ({
	activeChatId,
	isGroupChat = false,
}) => {
	const { chatMessages } = useChatMessages(activeChatId);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [chatMessages]);

	return (
		<div className="space-y-4 p-5">
			{chatMessages?.map((msg: Record<any, any>) =>
				isGroupChat ? (
					<GroupMessageView key={msg._id} message={msg} />
				) : (
					<PersonalMessageView key={msg._id} message={msg} />
				),
			)}
			<div ref={messagesEndRef} />
		</div>
	);
};
