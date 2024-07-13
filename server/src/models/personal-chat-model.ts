import { PERSONAL_CHAT_STATUS } from "@/utils/constants";
import { Schema, model } from "mongoose";

const personalChatSchema = new Schema<IPersonalChat>(
    {
        user1: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        user2: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        user1HasArchivedChat: {
            type: Boolean,
        },
        user2HasArchivedChat: {
            type: Boolean,
        },
        user1ChatStatus: {
            type: String,
            enum: [
                PERSONAL_CHAT_STATUS.ACTIVE,
                PERSONAL_CHAT_STATUS.BLOCKED,
                PERSONAL_CHAT_STATUS.DELETED,
            ],
            default: PERSONAL_CHAT_STATUS.ACTIVE,
        },
        user2ChatStatus: {
            type: String,
            enum: [
                PERSONAL_CHAT_STATUS.ACTIVE,
                PERSONAL_CHAT_STATUS.BLOCKED,
                PERSONAL_CHAT_STATUS.DELETED,
            ],
            default: PERSONAL_CHAT_STATUS.ACTIVE,
        },

        user1ChatStatusActiveTimestamp: {
            type: Date,
            default: Date.now,
        },

        user2ChatStatusActiveTimestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const PersonalChat = model<IPersonalChat>(
    "PersonalChat",
    personalChatSchema
);
