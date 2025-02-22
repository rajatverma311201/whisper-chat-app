import { PencilLine, User } from "lucide-react";

import { useState } from "react";

import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useUpdateProfile } from "@/hooks/users/use-update-profile";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import { ProfilePhoto } from "./profile-photo";
import useOutsideClick from "@/hooks/util/use-outside-click";

export const UserProfileSheet: React.FC = () => {
	const { currentUser } = useAuthUser();
	const { updateProfile, isUpdatingProfile } = useUpdateProfile();

	const [sheetOpen, setSheetOpen] = useState(false);

	const sheetRef = useOutsideClick<HTMLDivElement>(() => setSheetOpen(false));

	return (
		<Sheet open={sheetOpen} modal={false}>
			<SheetTrigger onClick={() => setSheetOpen(true)} asChild>
				<User
					size={50}
					className="cursor-pointer rounded-full bg-primary p-2 text-primary-foreground hover:opacity-90"
				/>
			</SheetTrigger>

			<SheetContent
				side="left"
				onCloseClick={() => setSheetOpen(false)}
				className="rounded-lg border-2 border-gray-200 bg-gray-100"
				ref={sheetRef}
			>
				<SheetHeader>
					<SheetTitle>Your Profile</SheetTitle>
				</SheetHeader>

				{/* Profile Photo Component */}
				<ProfilePhoto
					currentPhoto={currentUser?.photo}
					onUpdatePhoto={updateProfile}
				/>

				{/* User Profile Fields */}
				<div className="my-10 space-y-4">
					<UserProfileField label="Email">
						{currentUser?.email}
					</UserProfileField>

					<UserProfileEditableField
						label="Name"
						id="name"
						defaultValue={currentUser?.name}
						isUpdating={isUpdatingProfile}
						onUpdate={(value) => updateProfile({ name: value })}
					/>

					<UserProfileEditableField
						label="About"
						id="about"
						defaultValue={currentUser?.about}
						isUpdating={isUpdatingProfile}
						onUpdate={(value) => updateProfile({ about: value })}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
};

/**
 * Displays a label and value for a user profile field.
 */
const UserProfileField: React.FC<{
	label: string;
	children: React.ReactNode;
}> = ({ label, children }) => (
	<div>
		<p className="font-medium text-primary">{label}</p>
		<p>{children}</p>
	</div>
);

/**
 *  Editable user profile field with inline editing.
 */
const UserProfileEditableField: React.FC<{
	label: string;
	id: string;
	defaultValue?: string;
	isUpdating: boolean;
	onUpdate: (value: string) => void;
}> = ({ label, id, defaultValue, isUpdating, onUpdate }) => (
	<div>
		<p className="font-medium text-primary">{label}</p>
		<Label className="flex cursor-pointer" htmlFor={id}>
			<Input
				id={id}
				placeholder={label}
				defaultValue={defaultValue}
				disabled={isUpdating}
				className="h-auto rounded-none border-0 border-b-2 border-muted bg-inherit p-1 ring-0 focus:border-primary focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
				onBlur={(e) => {
					if (e.target.value !== defaultValue) {
						onUpdate(e.target.value);
					}
				}}
			/>
			<PencilLine className="h-auto p-1 text-primary" size={30} />
		</Label>
	</div>
);
