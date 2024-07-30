import { GroupChat } from "@/models/group-chat-model";
import { GroupParticipant } from "@/models/group-participant-model";
import { AppError } from "@/utils/app-error";
import { catchAsync } from "@/utils/catch-async";
import { RESPONSE_STATUS } from "@/utils/constants";

export const addParticipantToGroup = catchAsync(async (req, res, next) => {
    const { groupId, userId } = req.body;

    const group = await GroupChat.findById(groupId);

    if (!group) {
        return next(new AppError("Group not found", 404));
    }

    await GroupParticipant.create({
        group: groupId,
        user: userId,
    });

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: "Participant added to group",
    });
});

export const addParticipantsToGroup = catchAsync(async (req, res, next) => {
    const { groupId, userIds } = req.body;

    const group = await GroupChat.findById(groupId);

    if (!group) {
        return next(new AppError("Group not found", 404));
    }

    const participants = userIds.map((userId: string) => ({
        group: groupId,
        user: userId,
    }));

    await GroupParticipant.insertMany(participants);

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: "Participants added to group",
    });
});
