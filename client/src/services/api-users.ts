import { Fetch } from "@/lib/Fetch";

export const getAllUsers = async (): Promise<User[]> => {
	const url = "api/users";
	const data = await Fetch.GET(url);
	return data.data;
};

export const updateUserProfileDetails = async (
	updateData: Record<any, any>,
) => {
	const url = "api/users/update-my-profile";
	const data = await Fetch.PATCH(url, updateData);
	console.log(data);
	return data.data;
};
