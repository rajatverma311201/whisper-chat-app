import { getNameInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface GroupChatCardViewProps {
	name: string;
	onChatClick: () => void;
}

export const GroupChatCardView: React.FC<GroupChatCardViewProps> = ({
	name,
	onChatClick,
}) => {
	return (
		<>
			<div onClick={onChatClick}>
				<Avatar>
					<AvatarFallback>{getNameInitials(name)}</AvatarFallback>
				</Avatar>
			</div>
		</>
	);
};
