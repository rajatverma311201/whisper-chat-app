import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { cn } from "@/lib/utils";

interface PersonalMessageViewProps {
	message: Record<any, any>;
}

export const PersonalMessageView: React.FC<PersonalMessageViewProps> = ({
	message,
}) => {
	const { currentUser } = useAuthUser();

	const isMyMessage = currentUser?._id === message.sender._id;

	return (
		<p
			className={cn(
				"max-w-[500px] break-words rounded-xl px-4 py-3",
				isMyMessage ? "bg-emerald-600" : "bg-gray-200",
				isMyMessage ? "text-white" : "text-black",
				isMyMessage ? "ml-auto" : "mr-auto",
				isMyMessage ? "rounded-br-none" : "rounded-tl-none",
			)}
		>
			{message.content}
		</p>
	);
};
