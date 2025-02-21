import { Server as ExpressHttpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";

// // const socketIdToUserIdMap = new Map<string, string>();

// // export const setSocketIdToUserId = (userId: string, socketId: string) => {
// //     socketIdToUserIdMap.set(socketId, userId);
// // };

// // export const getSocketIdToUserId = (socketId: string) => {
// //     return socketIdToUserIdMap.get(socketId);
// // };

// // export const deleteSocketIdToUserId = (socketId: string) => {
// //     socketIdToUserIdMap.delete(socketId);
// // };

// // const userIdToSocketIdMap = new Map<string, string>();

// // export const setUserIdToSocketId = (userId: string, socketId: string) => {
// //     userIdToSocketIdMap.set(userId, socketId);
// // };

// // export const getUserIdToSocketId = (userId: string) => {
// //     return userIdToSocketIdMap.get(userId);
// // };

// // export const deleteUserIdToSocketId = (userId: string) => {
// //     userIdToSocketIdMap.delete(userId);
// // };

// export const deleteSocketIdAndUserId = (socketId: string) => {
//     const userId = socketIdToUserIdMap.get(socketId);
//     if (userId) {
//         userIdToSocketIdMap.delete(userId);
//     }
//     socketIdToUserIdMap.delete(socketId);
// };

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

        socket.on(SocketConst.PERSONAL_CHAT_MSG, (data) => {
            io.emit(SocketConst.PERSONAL_CHAT_MSG, data);
        });

        socket.on(SocketConst.PERSONAL_CHAT_TYPING, (data) => {
            console.log("typing", data);
            io.emit(SocketConst.PERSONAL_CHAT_TYPING, data);
        });

        socket.on(SocketConst.PERSONAL_CHAT_STOP_TYPING, (data) => {
            console.log("typing-stop", data);
            io.emit(SocketConst.PERSONAL_CHAT_STOP_TYPING, data);
            io.to(socket.id).emit(SocketConst.PERSONAL_CHAT_STOP_TYPING, data);
        });
    });
};

const SocketConst = {
    PERSONAL_CHAT_MSG: "personal-chat:msg",

    PERSONAL_CHAT_TYPING: "personal-chat:typing",

    PERSONAL_CHAT_STOP_TYPING: "personal-chat:stop-typing",
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
