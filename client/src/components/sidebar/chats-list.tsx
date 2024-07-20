import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { usePersonalChats } from "@/hooks/chats/use-personal-chats";
import { useActiveChat } from "@/hooks/global/use-active-chat";

interface ChatsListProps {}

export const ChatsList: React.FC<ChatsListProps> = ({}) => {
	const { personalChats, isLoadingPersonalChats } = usePersonalChats();
	const { currentUser } = useAuthUser();

	const setActiveChat = useActiveChat((state) => state.setActiveChat);

	if (isLoadingPersonalChats) {
		return <div>Loading...</div>;
	}

	console.log(personalChats);

	return (
		<div>
			<ul className="space-y-2 p-2">
				{personalChats?.map((chat: any) => {
					const [chatName, chatUserId] =
						currentUser?._id == chat.user1._id
							? [chat.user2.name, chat.user2._id]
							: [chat.user1.name, chat.user1._id];

					return (
						<li
							key={chat._id}
							className="bg-gray-100 px-4 py-2 hover:cursor-pointer hover:bg-gray-200"
							onClick={() => setActiveChat(chat)}
						>
							{chatName}
							{currentUser?._id == chatUserId ? " (You)" : ""}
						</li>
					);
				})}
			</ul>
		</div>
	);
};
