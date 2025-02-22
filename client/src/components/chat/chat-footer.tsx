import { Input } from "@/components/ui/input";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useActiveChat } from "@/hooks/global/use-active-chat";
import { useSocket } from "@/hooks/global/use-socket";
import { useSendMessage } from "@/hooks/messages/use-send-message";
import useSpeechRecognition from "@/hooks/util/use-speech-recognition";
import { SocketConst } from "@/lib/constants";
import {
	getGroupChatMessagesKey,
	getPersonalChatMessagesKey,
} from "@/lib/keys";
import { useQueryClient } from "@tanstack/react-query";
import { Mic, MicOff, Plus, Smile } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import EmojiPicker from "emoji-picker-react";
import useOutsideClick from "@/hooks/util/use-outside-click";

interface ChatFooterProps {}

export const ChatFooter: React.FC<ChatFooterProps> = ({}) => {
	const { activeChat } = useActiveChat();
	const { currentUser } = useAuthUser();
	const { socket } = useSocket();
	const typingRef = useRef<boolean>(false);
	const [message, setMessage] = useState("");
	const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const {
		isListening,
		transcript,
		startListening,
		stopListening,
		resetTranscript,
	} = useSpeechRecognition();

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

	const emojiPickerRef = useOutsideClick<HTMLDivElement>(() => {
		console.log("outside");
		setEmojiPickerOpen(false);
	});

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

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		if (!transcript || !transcript.trim()) return;
		setMessage((msg) => msg + " " + transcript);
	}, [transcript]);

	const handleTyping = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			handleStopTyping();
		}, 2000);

		if (typingRef.current) {
			return;
		}
		if (!activeChat?.chat._id) {
			return;
		}
		if (activeChat?.isGroupChat) {
			return;
		}

		typingRef.current = true;

		const users = [
			activeChat?.chat?.user1._id,
			activeChat?.chat?.user2._id,
		];
		const receiverId = users.find((user) => user !== currentUser?._id);

		socket.emit(SocketConst.PERSONAL_CHAT_TYPING, {
			chatId: activeChat?.chat._id,
			receiverId,
		});
	};

	const handleStopTyping = () => {
		if (!activeChat?.chat._id) {
			return;
		}
		if (activeChat?.isGroupChat) {
			return;
		}

		const users = [
			activeChat?.chat?.user1._id,
			activeChat?.chat?.user2._id,
		];
		const receiverId = users.find((user) => user !== currentUser?._id);

		socket.emit(SocketConst.PERSONAL_CHAT_STOP_TYPING, {
			chatId: activeChat?.chat._id,
			receiverId,
		});

		typingRef.current = false;
		timeoutRef.current = null;
	};

	return (
		<>
			<div className="flex items-center gap-2 p-5">
				<div className="" ref={emojiPickerRef}>
					<Button
						size={"icon"}
						variant={"outline"}
						onClick={() => setEmojiPickerOpen((v) => !v)}
					>
						<Smile className="stroke-[2.25px]" size={22.5} />
					</Button>
					<div className="fixed bottom-16">
						<EmojiPicker
							open={emojiPickerOpen}
							onEmojiClick={(emoji) => {
								setMessage(message + emoji.emoji);
								setEmojiPickerOpen(false);
							}}
						/>
					</div>
				</div>
				<Button size={"icon"} variant={"outline"}>
					<Plus className="stroke-[2.25px]" size={22.5} />
				</Button>
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
				{!isListening && (
					<Button
						onClick={startListening}
						size={"iconRound"}
						variant={"outline"}
					>
						<Mic className="stroke-[2px]" size={20} />
					</Button>
				)}
				{isListening && (
					<Button
						onClick={stopListening}
						size={"iconRound"}
						className="animate-pulse"
					>
						<MicOff className="stroke-[2.25px]" size={20} />
					</Button>
				)}
			</div>
		</>
	);
};
