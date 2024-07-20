import { useAllUsers } from "@/hooks/users/use-all-users";

interface UsersListProps {}

export const UsersList: React.FC<UsersListProps> = ({}) => {
	const { users, isLoadingUsers } = useAllUsers();

	if (isLoadingUsers) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<ul className="space-y-2 p-2">
				{users?.map((user) => (
					<li
						key={user._id}
						className="bg-gray-100 px-4 py-2 hover:bg-gray-200"
					>
						<div>{user.name}</div>
						{/* <div>{user.email}</div>
						<div>{user.role}</div>
						<div>{user.photo}</div> */}
					</li>
				))}
			</ul>
		</>
	);
};
