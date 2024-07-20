import { MESSAGE_STATUS } from "@/utils/constants";
import { Schema, model } from "mongoose";

const personalMessageSchema = new Schema<IPersonalMessage>(
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
        status: {
            type: String,
            enum: [
                MESSAGE_STATUS.SENT,
                MESSAGE_STATUS.DELIVERED,
                MESSAGE_STATUS.READ,
            ],
            default: MESSAGE_STATUS.SENT,
        },
        isEdited: {
            type: Boolean,
            default: false,
        },
        editedAt: {
            type: Date,
        },

        // For future use
        isDeleted: {
            type: Boolean,
            default: false,
        },

        // For future use
        deletedAt: {
            type: Date,
        },

        // For future use
        deletedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        // For future use
        deletedForEveryone: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for quicker queries by chat
personalMessageSchema.index({ chat: 1 });

export const PersonalMessage = model<IPersonalMessage>(
    "PersonalMessage",
    personalMessageSchema
);
