import { getNameInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
			<div
				onClick={onChatClick}
				className="flex cursor-pointer items-center gap-4 bg-slate-50 p-4 hover:bg-slate-100"
			>
				<Avatar>
					<AvatarFallback>{getNameInitials(name)}</AvatarFallback>
				</Avatar>
				<span className="text-black">{name}</span>
			</div>
		</>
	);
};
