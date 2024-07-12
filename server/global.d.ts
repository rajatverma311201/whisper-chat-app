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

    interface IChat extends Document {
        message: string;
        sender: string;
        receiver: string;
        createdAt: Date;
    }
}
