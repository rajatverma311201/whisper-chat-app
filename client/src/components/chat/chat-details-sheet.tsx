import { useActiveChatName } from "@/hooks/chats/use-active-chat-name";
import { useActiveChatUser } from "@/hooks/chats/use-active-chat-user";
import { useChatDetailsSheet } from "@/hooks/global/use-chat-details-sheet";
import { Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

interface ChatDetailsSheetProps {}

export const ChatDetailsSheet: React.FC<ChatDetailsSheetProps> = ({}) => {
	const { open, setOpen } = useChatDetailsSheet();
	const chatName = useActiveChatName();

	const activeUser = useActiveChatUser();

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen} modal={false}>
				<SheetContent side={"right"} className="">
					<SheetHeader>
						<SheetTitle className="">Contact Info</SheetTitle>

						<SheetDescription></SheetDescription>
					</SheetHeader>

					<div className="space-y-4">
						<User
							size={150}
							className="mx-auto rounded-full bg-primary p-5 text-primary-foreground"
						/>
						<div>
							<p className="text-center text-lg font-medium text-primary">
								{chatName}
							</p>

							{activeUser?.email && (
								<p className="text-center">
									{activeUser?.email}
								</p>
							)}
						</div>
					</div>
					<hr className="my-4" />
					<div className="">
						<p className="font-medium text-primary">About</p>
						<p>{activeUser?.about}</p>
					</div>

					{/* <SheetFooter> */}
					<div className="mt-20 flex flex-col items-stretch justify-end">
						<Button variant={"outlineDestructive"} size={"lg"}>
							<Trash2 className="mr-2" size={20} /> Delete Chat
						</Button>
					</div>
					{/* </SheetFooter> */}
				</SheetContent>
			</Sheet>
		</>
	);
};
