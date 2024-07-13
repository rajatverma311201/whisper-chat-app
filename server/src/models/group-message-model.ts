import { Schema, model } from "mongoose";

const groupMessageSchema = new Schema({
    group: {
        type: Schema.Types.ObjectId,
        ref: "GroupChat",
        required: true,
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    content: {
        type: String,
        required: true,
    },
});

groupMessageSchema.index({ group: 1 });

export const GroupMessage = model("GroupMessage", groupMessageSchema);
