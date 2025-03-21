import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface GroupMessageViewProps {
	message: Record<any, any>;
}

export const GroupMessageView: React.FC<GroupMessageViewProps> = ({
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
				"flex w-fit justify-end gap-1 break-words rounded-xl px-5 py-2",
				isMyMessage ? "bg-primary" : "bg-gray-200",
				isMyMessage ? "text-white" : "text-black",
				isMyMessage ? "ml-auto" : "mr-auto",
				isMyMessage ? "rounded-br-none" : "rounded-tl-none",
			)}
		>
			<div className="">
				{!isMyMessage && (
					<p className="text-xs font-semibold text-primary">
						{message.sender.name}
					</p>
				)}
				<p className="flex max-w-[500px] flex-col break-words">
					<>{message.content}</>
				</p>
			</div>
			{isMyMessage && (
				<span className="-mb-1.5 -mr-3 flex flex-col justify-end">
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
