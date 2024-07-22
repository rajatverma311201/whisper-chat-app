import { Schema, model } from "mongoose";

const groupMessageSchema = new Schema<IGroupMessage>(
    {
        groupChat: {
            type: Schema.Types.ObjectId,
            ref: "GroupChat",
        },
        msg: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
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
