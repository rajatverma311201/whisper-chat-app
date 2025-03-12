import { create } from "zustand";
import io, { Socket } from "socket.io-client";

// Initialize socket outside the store
const socket = io(process.env.NEXT_PUBLIC_API_URL, { autoConnect: false });

interface SocketState {
	socket: Socket;
	initSocket: (val: string) => void;
}
export const useSocket = create<SocketState>((set) => ({
	socket: socket, // Socket instance

	// Action to initialize socket and register user
	initSocket: (userId: string) => {
		if (!socket.connected) {
			socket.connect(); // Connect to the server
			socket.emit("init", userId); // Send user ID to server
		}
	},
}));
