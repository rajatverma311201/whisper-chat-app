import { model, Schema } from "mongoose";

const messageSchema = new Schema<IMessage>(
    {
        content: String,
        file: String,
        fileType: String,
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        isEdited: {
            type: Boolean,
            default: false,
        },
        editedAt: {
            type: Date,
        },
        deletedForEveryone: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const MessageModel = model<IMessage>("Message", messageSchema);
