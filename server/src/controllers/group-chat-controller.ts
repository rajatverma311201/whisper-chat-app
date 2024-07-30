import { GroupChat } from "@/models/group-chat-model";
import { GroupParticipant } from "@/models/group-participant-model";
import { catchAsync } from "@/utils/catch-async";
import { GROUP_PARTICIPANT_ROLE, RESPONSE_STATUS } from "@/utils/constants";

export const createGroupChat = catchAsync(async (req, res) => {
    const { name, description, image } = req.body;

    const groupChat = await GroupChat.create({
        name,
        description,
        image,
        createdBy: req.user._id,
    });

    res.status(201).json({
        status: "success",
        data: {
            groupChat,
        },
    });
});

export const createGroupChatWithUsers = catchAsync(async (req, res) => {
    const { name, userIds } = req.body;

    const groupChat = await GroupChat.create({
        name,
        createdBy: req.user._id,
    });

    const participants = userIds.map((userId: string) => ({
        group: groupChat._id,
        user: userId,
    }));

    participants.push({
        group: groupChat._id,
        user: req.user._id,
        role: GROUP_PARTICIPANT_ROLE.ADMIN,
    });

    await GroupParticipant.insertMany(participants);

    res.status(201).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: {
            groupChat,
        },
    });
});
