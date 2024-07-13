import { GROUP_PARTICIPANT_ROLE } from "@/utils/constants";
import { group } from "console";
import { Schema, model } from "mongoose";

const groupParticipantSchema = new Schema({
    group: {
        type: Schema.Types.ObjectId,
        ref: "GroupChat",
        required: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    role: {
        type: String,
        enum: [GROUP_PARTICIPANT_ROLE.ADMIN, GROUP_PARTICIPANT_ROLE.MEMBER],
        default: GROUP_PARTICIPANT_ROLE.MEMBER,
    },
});

groupParticipantSchema.index({ group: 1 });
groupParticipantSchema.index({ user: 1 });

export const GroupParticipant = model(
    "GroupParticipant",
    groupParticipantSchema
);
