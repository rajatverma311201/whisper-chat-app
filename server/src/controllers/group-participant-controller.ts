import { catchAsync } from "@/utils/catch-async";

export const addParticipantToGroup = catchAsync(async (req, res) => {
    const { groupId, userId } = req.body;
});

export const addParticipantsToGroup = catchAsync(async (req, res) => {
    const { groupId, userIds } = req.body;
});
