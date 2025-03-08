import { Server as ExpressHttpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { PersonalMessage } from "./models/personal-message-model";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

function generateShortRoomId(userId1: string, userId2: string): string {
	const sortedIds = [userId1.toString(), userId2.toString()].sort();
	const hash = crypto
		.createHash("sha256")
		.update(sortedIds.join("-"))
		.digest("base64");
	const shortHash = hash.replace(/[^a-zA-Z0-9]/g, "").substring(0, 8);
	const shortUUID = uuidv4().replace(/-/g, "").substring(0, 8);
	return `${shortUUID}-${shortHash}`;
}

export const socketHandler = (appHttpServer: ExpressHttpServer) => {
	const socketsAndUsers = new SocketsAndUsers();
	const io = new SocketServer(appHttpServer, {
		cors: {
			origin: "http://localhost:3000",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket: Socket) => {
		console.log("New client connected", socket.id);

		socket.on("init", (userId: string) => {
			socketsAndUsers.registerUser(socket.id, userId);
			console.log("User initialized", userId);
		});

		socket.on("disconnect", () => {
			console.log("Client disconnected", socket.id);
			socketsAndUsers.removeUser(socket.id);
		});

		socket.on(SocketConst.PERSONAL_CHAT_MSG_SEND, async (data) => {
			try {
				const receiverSocketId = socketsAndUsers.getSocketId(
					data.receiverId,
				);
				if (!receiverSocketId) return;

				const newMessage = new PersonalMessage({
					chat: data.chatId,
					sender: data.senderId,
					content: data.msg,
				});

				await newMessage.save();
				io.to(receiverSocketId).emit(
					SocketConst.PERSONAL_CHAT_MSG_RECEIVE,
					{
						...data,
						msg: newMessage,
					},
				);
			} catch (error) {
				console.error("Error sending message:", error);
			}
		});

		socket.on(SocketConst.PERSONAL_CHAT_TYPING, (data) => {
			const receiverSocketId = socketsAndUsers.getSocketId(
				data.receiverId,
			);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit(
					SocketConst.PERSONAL_CHAT_TYPING,
					data,
				);
			}
		});

		socket.on(SocketConst.PERSONAL_CHAT_STOP_TYPING, (data) => {
			const receiverSocketId = socketsAndUsers.getSocketId(
				data.receiverId,
			);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit(
					SocketConst.PERSONAL_CHAT_STOP_TYPING,
					data,
				);
			}
		});

		socket.on(SocketConst.PERSONAL_CHAT_MAKE_CALL, (data) => {
			const { makeCallTo, callerSignal, caller } = data;
			const receiverSocketId = socketsAndUsers.getSocketId(makeCallTo);
			if (receiverSocketId) {
				const roomId = generateShortRoomId(caller, makeCallTo);
				io.to(receiverSocketId).emit(
					SocketConst.PERSONAL_CHAT_INCOMING_CALL,
					{
						caller,
						callerSignal,
						roomId,
					},
				);
			}
		});

		socket.on(SocketConst.PERSONAL_CHAT_ACCEPT_INCOMING_CALL, (data) => {
			const { targetUserId, signal } = data;
			const targetSocketId = socketsAndUsers.getSocketId(targetUserId);
			if (targetSocketId) {
				io.to(targetSocketId).emit(
					SocketConst.PERSONAL_CHAT_ACCEPTED_INCOMING_CALL,
					{ signal },
				);
			}
		});

		socket.on(SocketConst.PERSONAL_CHAT_REJECT_INCOMING_CALL, (data) => {
			const { userId } = data;
			const receiverSocketId = socketsAndUsers.getSocketId(userId);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit(
					SocketConst.PERSONAL_CHAT_REJECTED_INCOMING_CALL,
				);
			}
		});

		socket.on(SocketConst.PERSONAL_CHAT_END_CALL, (data) => {
			const { userId } = data;
			const receiverSocketId = socketsAndUsers.getSocketId(userId);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit(
					SocketConst.PERSONAL_CHAT_END_CALL,
				);
			}
		});

		socket.on(SocketConst.SEND_ICE_CANDIDATE, (data) => {
			const { to, candidate } = data;
			const receiverSocketId = socketsAndUsers.getSocketId(to);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit(
					SocketConst.RECEIVE_ICE_CANDIDATE,
					{
						candidate,
					},
				);
			}
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
	RECEIVE_ICE_CANDIDATE: "receive-ice-candidate",
	SEND_ICE_CANDIDATE: "send-ice-candidate",
};

class SocketsAndUsers {
	private socketIdToUserIdMap: Map<string, string>;
	private userIdToSocketIdMap: Map<string, string>;

	constructor() {
		this.socketIdToUserIdMap = new Map<string, string>();
		this.userIdToSocketIdMap = new Map<string, string>();
	}

	public registerUser(socketId: string, userId: string): void {
		this.socketIdToUserIdMap.set(socketId, userId);
		this.userIdToSocketIdMap.set(userId, socketId);
	}

	public removeUser(socketId: string): void {
		const userId = this.socketIdToUserIdMap.get(socketId);
		if (userId) {
			this.socketIdToUserIdMap.delete(socketId);
			this.userIdToSocketIdMap.delete(userId);
		}
	}

	public getSocketId(userId: string): string | undefined {
		return this.userIdToSocketIdMap.get(userId);
	}
}
