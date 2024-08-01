import { Schema, model } from "mongoose";

const groupMessageSchema = new Schema<IGroupMessage>(
    {
        chat: {
            type: Schema.Types.ObjectId,
            ref: "GroupChat",
        },
        content: String,
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        isEdited: {
            type: Boolean,
            default: false,
        },
        editedAt: Date,
    },
    {
        timestamps: true,
    }
);

// Index for quicker queries by chat
groupMessageSchema.index({ chat: 1 });

export const GroupMessageModel = model<IGroupMessage>(
    "GroupMessage",
    groupMessageSchema
);
