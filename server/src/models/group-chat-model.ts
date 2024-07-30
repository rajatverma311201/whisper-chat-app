import { Schema, model } from "mongoose";

const groupChatSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        isGroupChat: {
            type: Boolean,
            default: true,
            immutable: true,
        },
        description: String,
        image: String,
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastMessageAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        timestamps: true,
    }
);

groupChatSchema.index({ createdBy: 1 });

export const GroupChat = model("GroupChat", groupChatSchema);
