import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useUpdateProfile } from "@/hooks/users/use-update-profile";
import { cn } from "@/lib/utils";
import { PencilLine, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { CldUploadButton, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useState } from "react";
import useOutsideClick from "@/hooks/util/use-outside-click";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface UserProfileSheetProps {}

export const UserProfileSheet: React.FC<UserProfileSheetProps> = ({}) => {
	const { currentUser } = useAuthUser();
	const sheetRef = useOutsideClick<HTMLDivElement>(() => {
		setSheetOpen(false);
	});

	const { updateProfile, isUpdatingProfile } = useUpdateProfile();
	const [sheetOpen, setSheetOpen] = useState(false);

	const [profilePhoto, setProfilePhoto] = useState(() => currentUser?.photo);

	const handleProfilePhotoUpload = (info: CloudinaryUploadWidgetInfo) => {
		const imgURL = info.url;
		setProfilePhoto(imgURL);
		updateProfile({
			photo: imgURL,
		});
	};

	return (
		<Sheet open={sheetOpen}>
			<SheetTrigger onClick={() => setSheetOpen(true)} asChild>
				<User
					size={40}
					className="cursor-pointer rounded-full bg-primary p-2 text-primary-foreground hover:opacity-90"
				/>
			</SheetTrigger>
			<SheetContent
				side={"left"}
				ref={sheetRef}
				onCloseClick={() => setSheetOpen(false)}
			>
				<SheetHeader>
					<SheetTitle>Your Profile</SheetTitle>
					<SheetDescription></SheetDescription>
				</SheetHeader>

				{profilePhoto ? (
					<div className="mx-auto h-auto w-fit overflow-hidden rounded-full">
						<Image
							src={profilePhoto}
							height={150}
							width={150}
							alt="Profile Photo"
							className=""
						/>
					</div>
				) : (
					<User
						size={100}
						className="mx-auto rounded-full bg-primary p-4 text-primary-foreground"
					/>
				)}
				<div className="my-10 space-y-4">
					<div>
						<Button asChild disabled={isUpdatingProfile}>
							<CldUploadButton
								onClick={() => {
									setSheetOpen(true);
								}}
								uploadPreset="whisper-chat-profile"
								signatureEndpoint={"/api/sign-cloudinary"}
								onSuccess={({ info }) => {
									handleProfilePhotoUpload(
										info as CloudinaryUploadWidgetInfo,
									);
								}}
							/>
						</Button>
					</div>
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
						<Label className="flex cursor-pointer" htmlFor="name">
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
								id="name"
							/>
							<PencilLine
								className="h-auto p-1 text-primary"
								size={30}
							/>
						</Label>
					</div>

					<div>
						<p className="font-medium text-primary">About</p>
						<Label className="flex cursor-pointer" htmlFor="about">
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
								id="about"
							/>
							<PencilLine
								className="h-auto p-1 text-primary"
								size={30}
							/>
						</Label>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
