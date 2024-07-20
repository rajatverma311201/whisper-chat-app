import { Fetch } from "@/lib/Fetch";

export const getAllUsers = async (): Promise<User[]> => {
	const url = "api/users";
	const data = await Fetch.GET(url);
	return data.data;
};
