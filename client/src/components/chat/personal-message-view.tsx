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

	// useEffect(() => {
	// 	if (isMyMessage) {
	// 		return;
	// 	}

	// 	if (message.status === "read") {
	// 		return;
	// 	}

	// 	updateMessageStatusToRead(message._id).then(() => {});
	// }, [isMyMessage, message]);

	return (
		<div
			className={cn(
				"flex w-fit gap-1.5 rounded-xl px-5 py-3",
				isMyMessage ? "bg-primary/90" : "bg-gray-200",
				isMyMessage ? "text-white" : "text-black",
				isMyMessage ? "ml-auto" : "mr-auto",
				isMyMessage ? "rounded-br-none" : "rounded-tl-none",
			)}
		>
			<p className="max-w-[500px] break-words">{message.content}</p>

			{isMyMessage && (
				<span className="-mb-1.5 -mr-2 flex flex-col justify-end">
					<>
						{message.status == "read" ? (
							<CheckCheck className="ml-auto" size={15} />
						) : (
							<Check className="ml-auto" size={15} />
						)}
					</>
				</span>
			)}
		</div>
	);
};
