import { Schema, model } from "mongoose";

const personalChatSchema = new Schema(
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
            default: false,
        },
        user2HasArchivedChat: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const PersonalChat = model("PersonalChat", personalChatSchema);
