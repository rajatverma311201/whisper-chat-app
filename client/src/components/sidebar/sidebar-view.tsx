import { UsersList } from "./users-list";

interface SidebarViewProps {}

export const SidebarView: React.FC<SidebarViewProps> = ({}) => {
	return (
		<div>
			<UsersList />
		</div>
	);
};
