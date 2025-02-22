import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useUpdateProfile } from "@/hooks/users/use-update-profile";
import { cn } from "@/lib/utils";
import { Camera, PencilLine, User } from "lucide-react";
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
import {
	CldUploadButton,
	CldUploadWidget,
	CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { useState } from "react";
import useOutsideClick from "@/hooks/util/use-outside-click";
import Image from "next/image";

interface UserProfileSheetProps {}

export const UserProfileSheet: React.FC<UserProfileSheetProps> = ({}) => {
	const { currentUser } = useAuthUser();
	const sheetRef = useOutsideClick<HTMLDivElement>(() => {
		setSheetOpen(false);
	});

	const profilePhotoDialogRef = useOutsideClick<HTMLImageElement>(() => {
		setSeeProfilePhotoOpen(false);
	});

	const { updateProfile, isUpdatingProfile } = useUpdateProfile();
	const [sheetOpen, setSheetOpen] = useState(false);

	const [profilePhotoOptsOpen, setProfilePhotoOptsOpen] = useState(false);

	const [profilePhoto, setProfilePhoto] = useState(() => currentUser?.photo);

	const [seeProfilePhotoOpen, setSeeProfilePhotoOpen] = useState(false);

	const handleProfilePhotoUpload = (info: CloudinaryUploadWidgetInfo) => {
		const imgURL = info.url;
		setProfilePhoto(imgURL);
		updateProfile({
			photo: imgURL,
		});
	};

	return (
		<Sheet open={sheetOpen} modal={false}>
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
				className="rounded-sm border-2 border-gray-200 bg-gray-100"
			>
				<SheetHeader>
					<SheetTitle>Your Profile</SheetTitle>
					<SheetDescription></SheetDescription>
				</SheetHeader>

				{profilePhoto && seeProfilePhotoOpen && (
					<div
						// open={}
						className="fixed inset-0 z-50 mx-auto flex items-center justify-center bg-slate-100/90"
					>
						<Image
							ref={profilePhotoDialogRef}
							src={profilePhoto}
							height={500}
							width={500}
							alt="Profile Photo"
							className="aspect-auto max-h-[90%] max-w-[90%]"
						/>
					</div>
				)}

				<div
					className="group relative mx-auto w-fit rounded-full"
					onMouseLeave={() => setProfilePhotoOptsOpen(false)}
				>
					<div
						onClick={() => {
							setProfilePhotoOptsOpen(true);
						}}
						className="absolute hidden h-full w-full cursor-pointer flex-col items-center justify-center rounded-full bg-gray-50/75 group-hover:flex"
					>
						<Camera className="mx-auto my-auto h-8 w-8 text-gray-600" />

						{/* <CardHeader /> */}

						<CldUploadWidget
							// onClick={() => {
							// 	setSheetOpen(true);
							// }}

							uploadPreset="whisper-chat-profile"
							signatureEndpoint={"/api/sign-cloudinary"}
							onSuccess={({ info }) => {
								handleProfilePhotoUpload(
									info as CloudinaryUploadWidgetInfo,
								);
							}}
							options={{
								maxFiles: 1,
							}}
						>
							{({ open }) => {
								return (
									<PhotoOptsList show={profilePhotoOptsOpen}>
										<PhotoOptsListItem
											onClick={() => {
												setProfilePhotoOptsOpen(false);
												setSeeProfilePhotoOpen(true);
											}}
										>
											See Photo
										</PhotoOptsListItem>
										<PhotoOptsListItem>
											Remove Photo
										</PhotoOptsListItem>
										<PhotoOptsListItem onClick={open}>
											Change Photo
										</PhotoOptsListItem>
									</PhotoOptsList>
								);
							}}
						</CldUploadWidget>
					</div>
					{profilePhoto ? (
						<div className="mx-auto w-fit overflow-hidden">
							<Image
								src={profilePhoto}
								height={150}
								width={150}
								alt="Profile Photo"
								className="aspect-square rounded-full object-cover"
							/>
						</div>
					) : (
						<User
							size={100}
							className="mx-auto rounded-full bg-primary p-4 text-primary-foreground"
						/>
					)}
				</div>
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
						<Label className="flex cursor-pointer" htmlFor="name">
							<Input
								placeholder="Name"
								defaultValue={currentUser?.name}
								disabled={isUpdatingProfile}
								autoFocus={false}
								className={cn(
									"h-auto rounded-none border-0 border-b-2 border-muted bg-inherit p-1 ring-0 focus:border-primary focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
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
									"h-auto rounded-none border-0 border-b-2 border-muted bg-inherit p-1 ring-0 focus:border-primary focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
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

interface PhotoOptsListProps {
	children: React.ReactNode;
	show: boolean;
}
const PhotoOptsList: React.FC<PhotoOptsListProps> = ({ children, show }) => {
	if (!show) return null;
	return (
		<ul
			className={cn(
				"absolute left-[30%] top-[30%]",
				"z-40 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
			)}
		>
			{children}
		</ul>
	);
};

interface PhotoOptsListItemProps {
	children: React.ReactNode;
	onClick?: () => void;
}
const PhotoOptsListItem: React.FC<PhotoOptsListItemProps> = ({
	children,
	onClick,
}) => {
	return (
		<li
			onClick={onClick}
			className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
		>
			{children}
		</li>
	);
};
