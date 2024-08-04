export {};

declare global {
	export interface User {
		_id: string;
		name: string;
		email: string;
		photo: string;
		role: "user" | "guide" | "lead-guide" | "admin";
		about: string;
		password: string;
		passwordConfirm: string;
		passwordChangedAt: Date;
		passwordResetToken: string;
		passwordResetExpires: Date;
		active: boolean;
	}
}
