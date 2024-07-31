import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useCreateGroupChatWithUsers } from "@/hooks/chats/use-create-group-chat-with-users";
import { useAllUsers } from "@/hooks/users/use-all-users";
import { getNameInitials } from "@/lib/utils";
import { Loader2, Users2, X } from "lucide-react";
import { Fragment as ReactFragment, useEffect, useState } from "react";

interface NewGroupModalProps {}

export const NewGroupModal: React.FC<NewGroupModalProps> = () => {
	const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
	const [otherUsers, setOtherUsers] = useState<User[]>([]);

	const [open, setOpen] = useState(false);

	const { currentUser } = useAuthUser();
	const { users } = useAllUsers();
	const { createGroupChat, isLoading: isCreatingGroupChat } =
		useCreateGroupChatWithUsers({ onSuccess: () => setOpen(false) });

	const [groupChatName, setGroupChatName] = useState("");

	useEffect(() => {
		if (users && currentUser) {
			setOtherUsers(users.filter((u) => u._id !== currentUser?._id));
		}
		return () => {
			setSelectedUsers([]);
			setOtherUsers([]);
		};
	}, [users, currentUser]);

	const handleSelectUser = (user: User) => {
		setSelectedUsers((prev) => [...prev, user]);
		setOtherUsers((prev) => prev.filter((u) => u._id !== user._id));
	};

	const handleRemoveUser = (user: User) => {
		setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
		setOtherUsers((prev) => [...prev, user]);
	};

	const handleClearSelections = (open: boolean) => {
		setOpen(open);

		if (!users || !currentUser) return;

		if (open) {
			return;
		}

		setSelectedUsers([]);
		setOtherUsers(users.filter((u) => u._id !== currentUser?._id));
	};

	const handleCreateGroup = () => {
		console.log("handleCreateGroup");
		createGroupChat({
			name: groupChatName,
			userIds: selectedUsers.map((u) => u._id),
		});
	};

	return (
		<Dialog onOpenChange={handleClearSelections} open={open}>
			<DialogTrigger asChild>
				<Button variant="outline">Edit Profile</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogDescription className="mb-2">
						<Users2
							className="mx-auto rounded-full bg-primary p-4 text-primary-foreground"
							size={75}
						/>
					</DialogDescription>
					<DialogTitle className="text-center">
						Create a New Group
					</DialogTitle>
				</DialogHeader>

				<Input
					placeholder="Enter group name"
					value={groupChatName}
					onChange={(e) => setGroupChatName(e.target.value)}
				/>

				<GroupSelectedUsersList
					selectedUsers={selectedUsers}
					onDeSelectUser={handleRemoveUser}
				/>
				<GroupCreationUsersList
					otherUsers={otherUsers}
					onSelectUser={handleSelectUser}
				/>

				<DialogFooter>
					<div className="flex justify-end">
						<Button
							onClick={handleCreateGroup}
							disabled={isCreatingGroupChat}
						>
							{isCreatingGroupChat ? (
								<>
									<Loader2
										size={18}
										className="mr-2 animate-spin"
									/>
									Creating
								</>
							) : (
								<>Create</>
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

interface GroupCreationUsersListProps {
	otherUsers: User[];
	onSelectUser: (user: User) => void;
}

export const GroupCreationUsersList: React.FC<GroupCreationUsersListProps> = ({
	otherUsers,
	onSelectUser,
}) => {
	return (
		<>
			<div className="rounded-md border p-2">
				<p className="mb-2 text-center font-medium">
					Choose Group Members
				</p>
				<ul className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
					{otherUsers?.map((user: User, idx: number) => {
						return (
							<ReactFragment key={user._id}>
								<li
									key={user._id}
									className="hover: flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-primary/20"
									onClick={(e) => onSelectUser(user)}
								>
									<Avatar>
										<AvatarFallback>
											{getNameInitials(user.name)}
										</AvatarFallback>
									</Avatar>{" "}
									{user.name}
								</li>
								{!(idx === otherUsers?.length - 1) && (
									<Separator />
								)}
							</ReactFragment>
						);
					})}
				</ul>
			</div>
		</>
	);
};

interface GroupSelectedUsersListProps {
	selectedUsers: User[];
	onDeSelectUser: (user: User) => void;
}

export const GroupSelectedUsersList: React.FC<GroupSelectedUsersListProps> = ({
	selectedUsers,
	onDeSelectUser,
}) => {
	return (
		<>
			<div className="flex gap-2">
				{selectedUsers.map((user) => (
					<Badge
						key={user._id}
						variant={"outline"}
						className="text-sm font-medium"
					>
						{user.name}{" "}
						<X
							onClick={(e) => onDeSelectUser(user)}
							size={20}
							className="-mr-2 ml-1 cursor-pointer rounded-full p-0.5 hover:bg-gray-200"
						/>
					</Badge>
				))}
			</div>
		</>
	);
};
