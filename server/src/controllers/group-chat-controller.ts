import { GroupChat } from "@/models/group-chat-model";
import { GroupMessageModel } from "@/models/group-message-model";
import { GroupParticipant } from "@/models/group-participant-model";
import { catchAsync } from "@/utils/catch-async";
import { GROUP_PARTICIPANT_ROLE, RESPONSE_STATUS } from "@/utils/constants";

export const getAllGroupChatsOfUser = catchAsync(async (req, res) => {
    const groupChatsTemp = await GroupParticipant.find({
        user: req.user._id,
    }).populate({ path: "group", select: "name description image" });

    const groupChats = groupChatsTemp.map(
        (groupParticipant) => groupParticipant.group
    );

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: groupChats,
    });
});

export const getAllMembersOfGroupChat = catchAsync(async (req, res) => {
    const groupParticipantsTemp = await GroupParticipant.find({
        group: req.params.groupId,
    }).populate({ path: "user", select: "name email image" });

    const groupParticipants = groupParticipantsTemp.map((groupParticipant) => ({
        user: groupParticipant.user,
        role: groupParticipant.role,
    }));

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: groupParticipants,
    });
});

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
        data: groupChat,
    });
});
export const getChatMessagesByChatId = catchAsync(async (req, res) => {
    const { chatId } = req.params;

    const messages = await GroupMessageModel.find({
        chat: chatId,
    })
        .populate({
            path: "sender",
            select: "name",
        })
        .sort({ createdAt: 1 });

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: messages,
    });
});
