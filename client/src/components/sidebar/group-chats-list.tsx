import { useGroupChats } from "@/hooks/chats/use-group-chats";
import { useActiveChat } from "@/hooks/global/use-active-chat";
import { GroupChatCardView } from "../group/group-chat-card-view";

interface GroupChatsListProps {}

export const GroupChatsList: React.FC<GroupChatsListProps> = ({}) => {
	const { groupChats, isLoadingGroupChats } = useGroupChats();

	const { setActiveChat } = useActiveChat();

	if (isLoadingGroupChats) {
		return null;
	}

	return (
		<>
			{groupChats?.map((chat: any) => (
				<GroupChatCardView
					key={chat._id}
					name={chat.name}
					onChatClick={() => {
						setActiveChat({
							isGroupChat: true,
							chat,
						});
					}}
				/>
			))}
		</>
	);
};
