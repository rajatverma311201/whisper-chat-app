import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { usePersonalChats } from "@/hooks/chats/use-personal-chats";
import { useActiveChat } from "@/hooks/global/use-active-chat";
import { getNameInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GroupChatsList } from "./group-chats-list";
import { useUnreadMessages } from "@/hooks/global/use-unread-messages";
import { Badge } from "../ui/badge";

interface ChatsListProps {}

export const ChatsList: React.FC<ChatsListProps> = ({}) => {
	const { personalChats, isLoadingPersonalChats } = usePersonalChats();
	const { currentUser } = useAuthUser();

	const { setActiveChat } = useActiveChat();

	const { getUnreadMessagesCount } = useUnreadMessages();

	if (isLoadingPersonalChats) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<ul className="space-y-2 p-2">
				{personalChats?.map((chat: any) => {
					const [chatName, chatUserId] =
						currentUser?._id == chat.user1._id
							? [chat.user2.name, chat.user2._id]
							: [chat.user1.name, chat.user1._id];

					const unreadMessagesCnt = getUnreadMessagesCount(chat._id);

					return (
						<li
							key={chat._id}
							className="flex items-center gap-2 bg-gray-100 px-4 py-2 hover:cursor-pointer hover:bg-gray-200"
							onClick={() =>
								setActiveChat({
									isGroupChat: false,
									chat: chat,
								})
							}
						>
							<Avatar>
								<AvatarFallback>
									{getNameInitials(chatName)}
								</AvatarFallback>
							</Avatar>
							<span className="text-black">
								{chatName}
								{currentUser?._id == chatUserId ? " (You)" : ""}
							</span>
							{unreadMessagesCnt > 0 && (
								<span>
									<Badge variant={"circular"}>
										{unreadMessagesCnt}
									</Badge>
								</span>
							)}
						</li>
					);
				})}
			</ul>
			<GroupChatsList />
		</div>
	);
};
