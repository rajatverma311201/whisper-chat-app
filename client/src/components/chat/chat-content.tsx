import { useActiveChat } from "@/hooks/global/use-active-chat";
import { useChatMessages } from "@/hooks/messages/use-chat-messages";
import { useEffect, useRef, useState } from "react";
import { GroupMessageView } from "../group/group-message-view";
import { PersonalMessageView } from "./personal-message-view";
import { useSocket } from "@/hooks/global/use-socket";
import { SocketConst } from "@/lib/constants";
import { useUnreadMessages } from "@/hooks/global/use-unread-messages";

interface ChatContentProps {}

export const ChatContent: React.FC<ChatContentProps> = ({}) => {
	const { activeChat } = useActiveChat();

	const activeChatId = activeChat?.chat._id;

	const { chatMessages } = useChatMessages(activeChatId);

	const [chatMessagesState, setChatMessagesState] = useState<
		Record<any, any>[]
	>([]);

	useEffect(() => {
		setChatMessagesState(chatMessages);
	}, [chatMessages]);

	const { getUnreadMessages, clearUnreadMessages, onNewMsgReceived } =
		useUnreadMessages();

	const { socket } = useSocket();

	console.log("*********** HELLO *************");

	useEffect(() => {
		console.log("INSIDE CHAT CONETNT");

		socket.on(SocketConst.PERSONAL_CHAT_MSG_RECEIVE, (data) => {
			console.log("msg CHAT CONTENT", { data });

			if (activeChatId == data.chatId) {
				clearUnreadMessages(activeChatId);

				setChatMessagesState((msgs) => [...msgs, data.msg]);
			} else {
				onNewMsgReceived({
					msg: data.msg,
					chatId: data.chatId,
				});
			}
		});

		return () => {
			socket.off(SocketConst.PERSONAL_CHAT_MSG_RECEIVE);
		};
	}, [socket, activeChatId, onNewMsgReceived, clearUnreadMessages]);

	useEffect(() => {
		return () => {
			clearUnreadMessages(activeChatId);
		};
	}, [activeChatId, clearUnreadMessages]);

	useEffect(() => {
		const timer = setTimeout(() => {
			clearUnreadMessages(activeChatId);
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [activeChatId, clearUnreadMessages]);

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
		<ChatContentSection
			activeChatId={activeChat.chat._id}
			isGroupChat={activeChat.isGroupChat}
			chatMessagesState={chatMessagesState}
		/>
	);
};

interface ChatContentSectionProps {
	activeChatId: string;
	isGroupChat?: boolean;
	chatMessagesState: Record<any, any>[];
}

export const ChatContentSection: React.FC<ChatContentSectionProps> = ({
	activeChatId,
	isGroupChat = false,
	chatMessagesState,
}) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const unreadMsgRef = useRef<HTMLHRElement>(null);

	const { getUnreadMessages } = useUnreadMessages();
	const unreadMessages = getUnreadMessages(activeChatId);

	useEffect(() => {
		const scrollToBottom = () => {
			if (unreadMessages) {
				unreadMsgRef.current?.scrollIntoView();
			} else {
				messagesEndRef.current?.scrollIntoView();
			}
		};
		scrollToBottom();
	}, [unreadMessages, chatMessagesState]);

	return (
		<div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-5 dark:bg-stone-950">
			{chatMessagesState?.map((msg: Record<any, any>) =>
				isGroupChat ? (
					<GroupMessageView key={msg._id} message={msg} />
				) : (
					<PersonalMessageView key={msg._id} message={msg} />
				),
			)}

			{unreadMessages && <hr ref={unreadMsgRef} />}

			{unreadMessages?.map((msg) =>
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
