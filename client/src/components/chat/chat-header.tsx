import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useActiveChatName } from "@/hooks/chats/use-active-chat-name";
import { useActiveChat } from "@/hooks/global/use-active-chat";
import { useChatDetailsSheet } from "@/hooks/global/use-chat-details-sheet";
import { useSocket } from "@/hooks/global/use-socket";
import { SocketConst } from "@/lib/constants";
import { getPersonalChatUser } from "@/lib/utils";
import { Phone, PhoneOff, User, VideoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useVideoCallStore } from "@/hooks/global/use-video-call-store";

export const ChatHeader: React.FC = () => {
	const { activeChat } = useActiveChat();
	const { currentUser } = useAuthUser();
	const { setOpen, open } = useChatDetailsSheet();
	const chatName = useActiveChatName();
	const { socket } = useSocket();
	const router = useRouter();

	const [incomingCall, setIncomingCall] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [callLoading, setCallLoading] = useState(false);
	const { setCallerSignal } = useVideoCallStore();

	const chatUser = getPersonalChatUser(activeChat, currentUser!);

	useEffect(() => {
		if (!currentUser || !activeChat || activeChat?.isGroupChat) return;

		const handleTyping = (data: any) => {
			if (data.chatId === activeChat.chat._id) setIsTyping(true);
		};
		const handleStopTyping = (data: any) => {
			if (data.chatId === activeChat.chat._id) setIsTyping(false);
		};
		const handleIncomingCall = (data: any) => {
			setCallerSignal(data.callerSignal);
			setIncomingCall(true);
		};

		socket.on(SocketConst.PERSONAL_CHAT_TYPING, handleTyping);
		socket.on(SocketConst.PERSONAL_CHAT_STOP_TYPING, handleStopTyping);
		socket.on(SocketConst.PERSONAL_CHAT_INCOMING_CALL, handleIncomingCall);

		return () => {
			socket.off(SocketConst.PERSONAL_CHAT_TYPING, handleTyping);
			socket.off(SocketConst.PERSONAL_CHAT_STOP_TYPING, handleStopTyping);
			socket.off(
				SocketConst.PERSONAL_CHAT_INCOMING_CALL,
				handleIncomingCall,
			);
		};
	}, [activeChat, currentUser, socket, setCallerSignal]);

	const handleMakeVideoCall = () => {
		if (!chatUser || !activeChat || activeChat?.isGroupChat) return;
		setCallLoading(true);

		router.push(`/video-call/${chatUser?._id}`);
	};

	const handleAcceptCall = () => {
		if (!chatUser) return;
		setCallLoading(true);
		router.push(`/video-call/${chatUser?._id}?action=accept`);
	};

	const handleRejectCall = () => {
		socket.emit(SocketConst.PERSONAL_CHAT_REJECT_INCOMING_CALL, {
			userId: chatUser?._id,
		});
		setIncomingCall(false);
	};

	if (!activeChat) return null;

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
				{chatName}
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
					disabled={callLoading}
				>
					<VideoIcon />
				</Button>
				{incomingCall && (
					<div className="absolute right-5 top-5 animate-bounce-in rounded-lg border bg-white px-5 py-2">
						<h2 className="text-center text-lg">Incoming Call</h2>
						<div className="mt-5 flex gap-2">
							<Button
								onClick={handleAcceptCall}
								disabled={callLoading}
							>
								<Phone size={15} className="mr-2" /> Accept
							</Button>
							<Button
								onClick={handleRejectCall}
								variant={"destructive"}
								disabled={callLoading}
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
