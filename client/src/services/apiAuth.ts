import { Fetch } from "@/lib/Fetch";

interface AuthResponse {
	user: User;
	jwtToken: string;
	jwtTokenExpiry: number;
	[key: string]: unknown;
}

export const getMyDetails = async (): Promise<User> => {
	const url = "api/auth/get-current-user";
	const data = await Fetch.GET(url);
	return data.data;
};

export const login = async (
	email: string,
	password: string,
): Promise<AuthResponse> => {
	const url = "api/auth/login";
	const data = await Fetch.POST(url, { email, password });
	return data.data;
};

export const signup = async (
	name: string,
	email: string,
	password: string,
	passwordConfirm: string,
): Promise<AuthResponse> => {
	const url = "api/auth/signup";
	const data = await Fetch.POST(url, {
		name,
		email,
		password,
		passwordConfirm,
	});
	return data.data;
};

export const logout = async () => {
	const url = "api/auth/logout";
	return await Fetch.GET(url);
};

export const providerAuth = async (
	token: string,
	provider: "google" | "github",
) => {
	const url = `api/auth/provider?name=${provider}`;
	const { data } = await Fetch.POST(url, { token });
	return data;
};
