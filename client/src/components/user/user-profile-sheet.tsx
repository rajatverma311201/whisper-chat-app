import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useUpdateProfile } from "@/hooks/users/use-update-profile";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { Input } from "../ui/input";
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
	const { currentUser } = useAuthUser();

	const { updateProfile, isUpdatingProfile } = useUpdateProfile();

	return (
		<Sheet>
			<SheetTrigger>
				<User
					size={40}
					className="cursor-pointer rounded-full bg-primary p-2 text-primary-foreground hover:opacity-90"
				/>
			</SheetTrigger>
			<SheetContent side={"left"}>
				<SheetHeader>
					<SheetTitle>Your Profile</SheetTitle>
					<SheetDescription></SheetDescription>
				</SheetHeader>

				<User
					size={100}
					className="mx-auto rounded-full bg-primary p-4 text-primary-foreground"
				/>
				<div className="my-10 space-y-4">
					<div>
						<p className="font-medium text-primary">Email</p>
						{/* <Input
							placeholder="Email"
							className={cn(
								"rounded-none border-0",
								"border-b-2",
							)}
						/> */}
						<p>{currentUser?.email}</p>
					</div>

					<div>
						<p className="font-medium text-primary">Name</p>
						<Input
							placeholder="Name"
							defaultValue={currentUser?.name}
							disabled={isUpdatingProfile}
							autoFocus={false}
							className={cn(
								"rounded-none border-0",
								"h-auto border-b-2 border-muted p-1 ring-0 focus:border-primary focus:ring-0 focus-visible:ring-0",
							)}
							onBlur={(e) => {
								if (e.target.value === currentUser?.name)
									return;

								updateProfile({ name: e.target.value });
							}}
						/>
					</div>

					<div>
						<p className="font-medium text-primary">About</p>
						<Input
							placeholder="About"
							defaultValue={currentUser?.about}
							disabled={isUpdatingProfile}
							autoFocus={false}
							className={cn(
								"rounded-none border-0",
								"h-auto border-b-2 border-muted p-1 ring-0 focus:border-primary focus:ring-0 focus-visible:ring-0",
							)}
							onBlur={(e) => {
								if (e.target.value === currentUser?.about)
									return;

								updateProfile({ about: e.target.value });
							}}
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
