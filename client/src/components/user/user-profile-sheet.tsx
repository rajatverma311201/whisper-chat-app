import { User } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet";

interface UserProfileSheetProps {}

export const UserProfileSheet: React.FC<UserProfileSheetProps> = ({}) => {
	return (
		<Sheet>
			<SheetTrigger>
				<User
					size={40}
					className="cursor-pointer rounded-full bg-primary p-2 text-primary-foreground hover:opacity-90"
				/>
			</SheetTrigger>
			<SheetContent side={"right"}>
				<SheetHeader>
					<SheetTitle>Are you absolutely sure?</SheetTitle>
					<SheetDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
						servers.
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
};
