import { NewGroupModal } from "@/components/group/new-group-modal";
import { ChatsList } from "@/components/sidebar/chats-list";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useLogout } from "@/hooks/auth/use-logout";

interface SidebarViewProps {}

export const SidebarView: React.FC<SidebarViewProps> = ({}) => {
	const logout = useLogout();
	const { currentUser } = useAuthUser();
	return (
		<div className="p-2">
			<div className="rounded-lg border p-4">
				<h1>{currentUser?.name}</h1>
				<h2>{currentUser?.email}</h2>
			</div>
			<Button onClick={logout}>Logout</Button>
			<NewGroupModal />
			<ChatsList />
		</div>
	);
};
