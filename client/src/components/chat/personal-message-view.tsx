import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { cn } from "@/lib/utils";
import { updateMessageStatusToRead } from "@/services/api-messages";
import { Check, CheckCheck } from "lucide-react";
import { useEffect } from "react";

interface PersonalMessageViewProps {
	message: Record<any, any>;
}

export const PersonalMessageView: React.FC<PersonalMessageViewProps> = ({
	message,
}) => {
	const { currentUser } = useAuthUser();

	const isMyMessage = currentUser?._id === message.sender._id;
	console.log("isMyMessage", message);

	useEffect(() => {
		if (isMyMessage) {
			return;
		}

		if (message.status === "read") {
			return;
		}

		updateMessageStatusToRead(message._id).then(() => {});
	}, [isMyMessage, message]);

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
			{isMyMessage && (
				<>
					{message.status == "read" ? (
						<CheckCheck className="ml-auto" size={15} />
					) : (
						<Check className="ml-auto" size={15} />
					)}
				</>
			)}
		</p>
	);
};
