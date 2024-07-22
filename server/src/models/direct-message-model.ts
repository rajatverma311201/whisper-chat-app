import { Schema, model } from "mongoose";

const directMessageSchema = new Schema<IDirectMessage>(
    {
        directChat: {
            type: Schema.Types.ObjectId,
            ref: "DirectChat",
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
directMessageSchema.index({ chat: 1 });

export const DirectMessageModel = model<IDirectMessage>(
    "DirectMessage",
    directMessageSchema
);
