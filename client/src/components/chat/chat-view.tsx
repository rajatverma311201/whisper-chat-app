import { ChatContent } from "@/components/chat/chat-content";
import { ChatFooter } from "@/components/chat/chat-footer";
import { ChatHeader } from "@/components/chat/chat-header";

interface ChatViewProps {}

export const ChatView: React.FC<ChatViewProps> = ({}) => {
	return (
		<div className="flex h-full flex-col justify-between">
			<ChatHeader />
			<ChatContent />
			<ChatFooter />
		</div>
	);
};
