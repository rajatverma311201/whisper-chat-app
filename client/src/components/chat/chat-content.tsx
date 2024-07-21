import { useActiveChat } from "@/hooks/global/use-active-chat";
import { useChatMessages } from "@/hooks/messages/use-chat-messages";
import { useEffect, useRef } from "react";
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

	return (
		<div className="flex-1 overflow-y-auto bg-gray-50">
			<ChatContentSection activeChatId={activeChat._id} />
		</div>
	);
};

interface ChatContentSectionProps {
	activeChatId: string;
}

export const ChatContentSection: React.FC<ChatContentSectionProps> = ({
	activeChatId,
}) => {
	const { chatMessages } = useChatMessages(activeChatId);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	console.log(chatMessages);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [chatMessages]);

	return (
		<div className="space-y-4 p-5">
			{chatMessages?.map((msg: Record<any, any>) => (
				<PersonalMessageView key={msg._id} message={msg} />
			))}
			<div ref={messagesEndRef} />
		</div>
	);
};
