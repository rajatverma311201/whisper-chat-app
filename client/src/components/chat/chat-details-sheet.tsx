import { useActiveChatName } from "@/hooks/global/use-active-chat-name";
import { useChatDetailsSheet } from "@/hooks/global/use-chat-details-sheet";
import { User } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "../ui/sheet";

interface ChatDetailsSheetProps {}

export const ChatDetailsSheet: React.FC<ChatDetailsSheetProps> = ({}) => {
	const { open, setOpen } = useChatDetailsSheet();
	const chatName = useActiveChatName();

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen} modal={false}>
				<SheetContent side={"right"}>
					<SheetHeader>
						<SheetTitle className="">Contact Info</SheetTitle>

						<div className="my-4 space-y-4">
							<User
								size={150}
								className="mx-auto rounded-full bg-primary p-5 text-primary-foreground"
							/>
							<p className="text-center text-lg font-medium text-primary">
								{chatName}
							</p>

							{/* <p></p> */}
						</div>
						<hr />
						<div>
							<p>About</p>
							<p></p>
						</div>

						<SheetDescription></SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</>
	);
};
