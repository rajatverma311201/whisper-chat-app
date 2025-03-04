import { Server as ExpressHttpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { PersonalMessage } from "./models/personal-message-model";

export const socketHandler = (appHttpServer: ExpressHttpServer) => {
	const socketsAndUsers = new SocketsAndUsers();

	const io = new SocketServer(appHttpServer, {
		cors: {
			origin: "http://localhost:3000", // React app URL
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket: Socket) => {
		console.log("New client connected", socket.id);

		socket.on("init", (userId: string) => {
			socketsAndUsers.registerUser(socket.id, userId);
			console.log("init", userId);
		});

		socket.on("disconnect", () => {
			console.log("Client disconnected");
			socketsAndUsers.removeUser(socket.id);
		});

		socket.on(SocketConst.PERSONAL_CHAT_MSG_SEND, (data) => {
			console.log("msg", data);
			const receiverSocketId = socketsAndUsers.getSocketId(
				data.receiverId,
			);
			console.log("receiverSocketId", receiverSocketId);

			const newMessage = new PersonalMessage({
				chat: data.chatId,
				sender: data.senderId,
				content: data.msg,
			});

			console.log("newMessage", { newMessage });

			io.to(receiverSocketId).emit(
				SocketConst.PERSONAL_CHAT_MSG_RECEIVE,
				{ ...data, msg: newMessage },
			);

			newMessage.save();

			// io.emit(SocketConst.PERSONAL_CHAT_MSG_SEND, data);
		});

		socket.on(SocketConst.PERSONAL_CHAT_TYPING, (data) => {
			console.log("typing", data);

			const receiverSocketId = socketsAndUsers.getSocketId(
				data.receiverId,
			);

			io.to(receiverSocketId).emit(
				SocketConst.PERSONAL_CHAT_TYPING,
				data,
			);
		});

		socket.on(SocketConst.PERSONAL_CHAT_STOP_TYPING, (data) => {
			console.log("typing-stop", data);
			const receiverSocketId = socketsAndUsers.getSocketId(
				data.receiverId,
			);
			io.to(receiverSocketId).emit(
				SocketConst.PERSONAL_CHAT_STOP_TYPING,
				data,
			);
		});

		socket.on(SocketConst.PERSONAL_CHAT_MAKE_CALL, (data) => {
			console.log("make-video-call", data);
			const receiverSocketId = socketsAndUsers.getSocketId(
				data.makeCallTo,
			);
			io.to(receiverSocketId).emit(
				SocketConst.PERSONAL_CHAT_INCOMING_CALL,
				data,
			);
		});

		socket.on(SocketConst.PERSONAL_CHAT_ACCEPT_INCOMING_CALL, (data) => {
			const { targetUserId } = data;
			io.to(targetUserId).emit("call-accepted", {
				peerConnectionData: "data",
			});
		});

		socket.on(SocketConst.PERSONAL_CHAT_REJECT_INCOMING_CALL, (data) => {
			const { userId } = data;
			console.log("reject-incoming-call", data);
			const receiverSocketId = socketsAndUsers.getSocketId(userId);
			io.to(receiverSocketId).emit(
				SocketConst.PERSONAL_CHAT_REJECTED_INCOMING_CALL,
			);
		});
	});
};

const SocketConst = {
	PERSONAL_CHAT_MSG_SEND: "personal-chat:msg-send",
	PERSONAL_CHAT_MSG_RECEIVE: "personal-chat:msg-receive",

	PERSONAL_CHAT_TYPING: "personal-chat:typing",

	PERSONAL_CHAT_STOP_TYPING: "personal-chat:stop-typing",
	PERSONAL_CHAT_MAKE_CALL: "personal-chat:make-call",
	PERSONAL_CHAT_INCOMING_CALL: "personal-chat:incoming-call",

	PERSONAL_CHAT_ACCEPT_INCOMING_CALL: "personal-chat:accept-incoming-call",
	PERSONAL_CHAT_ACCEPTED_INCOMING_CALL:
		"personal-chat:accepted-incoming-call",
	PERSONAL_CHAT_REJECT_INCOMING_CALL: "personal-chat:reject-incoming-call",
	PERSONAL_CHAT_REJECTED_INCOMING_CALL:
		"personal-chat:rejected-incoming-call",
	PERSONAL_CHAT_END_CALL: "personal-chat:end-call",
};

class Sockets {
	private socketIdToUserIdMap: Map<string, string>;
	private userIdToSocketIdMap: Map<string, string>;

	constructor() {
		this.socketIdToUserIdMap = new Map<string, string>();
		this.userIdToSocketIdMap = new Map<string, string>();
	}
}

class SocketsAndUsers {
	private socketIdToUserIdMap: Map<string, string>;
	private userIdToSocketIdMap: Map<string, string>;

	constructor() {
		this.socketIdToUserIdMap = new Map<string, string>();
		this.userIdToSocketIdMap = new Map<string, string>();
	}

	// Register a user with their socket ID
	public registerUser(socketId: string, userId: string): void {
		this.socketIdToUserIdMap.set(socketId, userId);
		this.userIdToSocketIdMap.set(userId, socketId);
	}

	// Remove a user when they disconnect
	public removeUser(socketId: string): void {
		const userId = this.socketIdToUserIdMap.get(socketId);
		if (userId) {
			this.socketIdToUserIdMap.delete(socketId);
			this.userIdToSocketIdMap.delete(userId);
		}
	}

	// Get user ID from socket ID
	public getUserId(socketId: string): string | undefined {
		return this.socketIdToUserIdMap.get(socketId);
	}

	// Get socket ID from user ID
	public getSocketId(userId: string): string | undefined {
		return this.userIdToSocketIdMap.get(userId);
	}

	// Check if a user is online
	public isUserOnline(userId: string): boolean {
		return this.userIdToSocketIdMap.has(userId);
	}

	// Get all online users
	public getOnlineUsers(): string[] {
		return Array.from(this.userIdToSocketIdMap.keys());
	}

	// Get total number of connected users
	public getConnectedCount(): number {
		return this.socketIdToUserIdMap.size;
	}
}
