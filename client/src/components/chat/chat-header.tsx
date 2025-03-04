import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useActiveChatName } from "@/hooks/chats/use-active-chat-name";
import { useActiveChat } from "@/hooks/global/use-active-chat";
import { useChatDetailsSheet } from "@/hooks/global/use-chat-details-sheet";
import { useSocket } from "@/hooks/global/use-socket";
import { SocketConst } from "@/lib/constants";
import { getPersonalChatUser } from "@/lib/utils";
import { Phone, PhoneOff, User, VideoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {}

export const ChatHeader: React.FC<ChatHeaderProps> = ({}) => {
	const { activeChat } = useActiveChat();
	const { currentUser } = useAuthUser();
	const { setOpen, open } = useChatDetailsSheet();
	const chatName = useActiveChatName();
	const { socket } = useSocket();

	const [incomingCall, setIncomingCall] = useState(false);

	const [isTyping, setIsTyping] = useState(false);

	const router = useRouter();

	const chatUser = getPersonalChatUser(activeChat, currentUser!);

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

	useEffect(() => {
		socket.on(SocketConst.PERSONAL_CHAT_INCOMING_CALL, (data) => {
			console.log("INCOMING VIDEO CALL", data);
			setIncomingCall(true);
		});
	}, [socket]);

	const handleMakeVideoCall = () => {
		if (!chatUser || !activeChat || activeChat?.isGroupChat) {
			return;
		}

		console.log("MAKE VIDEO CALL");

		router.push(`/video-call/${chatUser?._id}`);

		// socket.emit(SocketConst.PERSONAL_CHAT_MAKE_CALL, {
		// 	makeCallTo: chatUser?._id,
		// });
	};

	const handleAcceptCall = () => {};
	const handleRejectCall = () => {};
	if (!activeChat) {
		return null;
	}

	return (
		<div className="relative flex">
			<h1 className="flex flex-1 items-center gap-2 p-5 font-medium text-primary">
				<Avatar>
					<AvatarFallback>
						<User
							size={40}
							className="cursor-pointer rounded-full bg-primary p-2 text-primary-foreground"
							onClick={() => !open && setOpen(true)}
						/>
					</AvatarFallback>
					<AvatarImage src={chatUser?.photo} />
				</Avatar>
				{activeChat ? chatName : "ChatHeader"}
				{isTyping && (
					<span className="ml-5 text-primary/75">Typing...</span>
				)}
			</h1>
			<div className="mr-5 flex items-center px-4 py-2">
				<Button
					size={"icon"}
					variant={"outline"}
					className="text-primary"
					onClick={handleMakeVideoCall}
				>
					<VideoIcon />
				</Button>
				{incomingCall && (
					<div className="animate-bounce-in absolute right-5 top-5 rounded-lg border bg-white px-5 py-2 [animation-fill-mode:forwards] [animation-iteration-count:2]">
						<h2 className="text-center text-lg">Incoming Call</h2>
						<div className="mt-5 flex gap-2">
							<Button
								onClick={handleAcceptCall}
								// size={"icon"}
							>
								<Phone size={15} className="mr-2" /> Accept
							</Button>
							<Button
								onClick={handleRejectCall}
								variant={"destructive"}
								// size={"icon"}
							>
								<PhoneOff size={15} className="mr-2" /> Reject
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
