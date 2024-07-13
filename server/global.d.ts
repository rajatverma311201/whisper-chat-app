import { Document } from "mongoose";

export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
            PORT: number;
            DATABASE_URI: string;
            DATABASE_PASSWORD: string;
            JWT_EXPIRES_IN: string;
            JWT_SECRET: string;
            // Add more variables as needed
        }
    }
    interface IUser extends Document {
        name: string;
        email: string;
        photo: string;
        role: string;
        password: string;
        passwordConfirm: string;
        passwordChangedAt: Date;
        passwordResetToken: string;
        passwordResetExpires: Date;
        active: boolean;
        correctPassword: (
            candidatePassword: string,
            userPassword: string
        ) => Promise<boolean>;

        changedPasswordAfter: (JWTTimestamp: number) => boolean;
    }

    interface IPersonalChat extends Document {
        user1: IUser;
        user2: IUser;
        user1HasArchivedChat: boolean;
        user2HasArchivedChat: boolean;
        user1ChatStatus: string;
        user2ChatStatus: string;
        user1ChatStatusActiveTimestamp: Date;
        user2ChatStatusActiveTimestamp: Date;
    }

    interface IPersonalMessage extends Document {
        chat: IPersonalChat;
        content: string;
        sender: IUser;
        receiver: IUser;
        status: string;
        isEdited: boolean;
        editedAt: Date;
        isDeleted: boolean;
        deletedAt: Date;
        deletedBy: IUser[];
        deletedForEveryone: boolean;
    }
}
