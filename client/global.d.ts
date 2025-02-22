export {};

declare global {
	interface Window {
		SpeechRecognition: SpeechRecognitionStatic;
		webkitSpeechRecognition: SpeechRecognitionStatic;
	}
	interface SpeechRecognitionStatic {
		new (): SpeechRecognition;
	}

	interface SpeechRecognition {
		lang: string;
		continuous: boolean;
		interimResults: boolean;
		onstart: () => void;
		onend: () => void;
		onerror: (event: { error: string }) => void;
		onresult: (event: { results: SpeechRecognitionResultList }) => void;
		start: () => void;
		stop: () => void;
		abort: () => void;
	}

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
	type Nullable<T> = T | null;
}
