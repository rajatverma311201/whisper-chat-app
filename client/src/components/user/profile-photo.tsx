import useOutsideClick from "@/hooks/util/use-outside-click";
import { Camera, User } from "lucide-react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";

interface ProfilePhotoProps {
	currentPhoto?: string;
	onUpdatePhoto: (data: any) => void;
}
export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
	currentPhoto,
	onUpdatePhoto,
}) => {
	const [optionsOpen, setOptionsOpen] = useState(false);
	const [viewPhoto, setViewPhoto] = useState(false);

	const photoDialogRef = useOutsideClick<HTMLImageElement>(() =>
		setViewPhoto(false),
	);

	const handlePhotoUpload = (info: CloudinaryUploadWidgetInfo) => {
		const newPhoto = info.url;
		onUpdatePhoto({ photo: newPhoto });
	};

	return (
		<>
			{/* View Photo Dialog */}
			{currentPhoto && viewPhoto && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100/90">
					<Image
						ref={photoDialogRef}
						src={currentPhoto}
						height={500}
						width={500}
						alt="Profile Photo"
						className="max-h-[90%] max-w-[90%]"
					/>
				</div>
			)}

			{/* Profile Image Section */}
			<div
				className="group relative mx-auto w-fit rounded-full"
				onMouseLeave={() => setOptionsOpen(false)}
			>
				{/* Overlay for Photo Actions */}
				<div
					onClick={() => setOptionsOpen(true)}
					className="absolute hidden h-full w-full flex-col items-center justify-center rounded-full bg-gray-50/75 group-hover:flex"
				>
					<Camera className="h-8 w-8 text-gray-600" />
					<CldUploadWidget
						uploadPreset="whisper-chat-profile"
						signatureEndpoint="/api/sign-cloudinary"
						onSuccess={({ info }) =>
							handlePhotoUpload(
								info as CloudinaryUploadWidgetInfo,
							)
						}
						options={{ maxFiles: 1 }}
					>
						{({ open }) => (
							<PhotoOptionsList show={optionsOpen}>
								<PhotoOptionItem
									onClick={() => setViewPhoto(true)}
								>
									See Photo
								</PhotoOptionItem>
								<PhotoOptionItem
									onClick={() =>
										onUpdatePhoto({ photo: null })
									}
								>
									Remove Photo
								</PhotoOptionItem>
								<PhotoOptionItem onClick={open}>
									Change Photo
								</PhotoOptionItem>
							</PhotoOptionsList>
						)}
					</CldUploadWidget>
				</div>

				{/* Display Profile Image or Placeholder */}
				<div className="mx-auto w-fit rounded-full">
					{currentPhoto ? (
						<Image
							src={currentPhoto}
							height={150}
							width={150}
							alt="Profile Photo"
							className="aspect-square rounded-full object-cover"
						/>
					) : (
						<User
							size={100}
							className="mx-auto rounded-full bg-primary p-4 text-primary-foreground"
						/>
					)}
				</div>
			</div>
		</>
	);
};

/**
 *  List of photo management options.
 */
interface PhotoOptionsListProps {
	show: boolean;
	children: React.ReactNode;
}
const PhotoOptionsList: React.FC<PhotoOptionsListProps> = ({
	show,
	children,
}) =>
	show ? (
		<ul className="absolute left-[40%] top-[50%] z-40 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
			{children}
		</ul>
	) : null;

/**
 *  Individual photo management option item.
 */
interface PhotoOptionItemProps {
	children: React.ReactNode;
	onClick?: () => void;
}
const PhotoOptionItem: React.FC<PhotoOptionItemProps> = ({
	children,
	onClick,
}) => (
	<li
		onClick={onClick}
		className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
	>
		{children}
	</li>
);
