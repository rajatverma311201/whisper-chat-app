import { MESSAGE_STATUS } from "@/utils/constants";
import { Schema, model } from "mongoose";

const personalMessageSchema = new Schema(
    {
        chat: {
            type: Schema.Types.ObjectId,
            ref: "PersonalChat",
        },
        content: String,
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: [
                MESSAGE_STATUS.SENT,
                MESSAGE_STATUS.DELIVERED,
                MESSAGE_STATUS.READ,
            ],
            default: MESSAGE_STATUS.SENT,
        },
    },
    {
        timestamps: true,
    }
);

// Index for quicker queries by chat
personalMessageSchema.index({ chat: 1 });

export const PersonalMessage = model("PersonalMessage", personalMessageSchema);
