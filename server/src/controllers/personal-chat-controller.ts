import { PersonalChat } from "@/models/personal-chat-model";
import { PersonalMessage } from "@/models/personal-message-model";
import { AppError } from "@/utils/app-error";
import { catchAsync } from "@/utils/catch-async";
import { RESPONSE_STATUS } from "@/utils/constants";

export const getAllMyPersonalChats = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const personalChats = await PersonalChat.find({
        $or: [{ user1: userId }, { user2: userId }],
    })
        .populate({
            path: "user1",
            select: "name",
        })
        .populate({
            path: "user2",
            select: "name",
        });

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: personalChats,
        results: personalChats.length,
    });
});

export const createPersonalChatByUserId = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const { userId: userId2 } = req.body;

    if (!userId2) {
        return next(new AppError("Another User is required", 400));
    }

    const personalChatExists = await PersonalChat.findOne({
        $or: [
            { user1: userId, user2: userId2 },
            { user1: userId2, user2: userId },
        ],
    });

    if (personalChatExists) {
        return next(new AppError("Personal chat already exists", 400));
    }

    const personalChat = await PersonalChat.create({
        user1: userId,
        user2: userId2,
    });

    res.status(201).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: personalChat,
    });
});

export const getPersonalChatByChatId = catchAsync(async (req, res, next) => {
    // const userId = req.user._id;
    const { chatId } = req.params;

    const personalChat = await PersonalChat.findById(chatId);

    if (!personalChat) {
        return next(new AppError("Personal chat not found", 404));
    }

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: personalChat,
    });
});

export const getPersonalChatByUsers = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const { userId2 } = req.params;

    const personalChat = await PersonalChat.findOne({
        $or: [
            { user1: userId, user2: userId2 },
            { user1: userId2, user2: userId },
        ],
    });

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: personalChat,
    });
});

export const archivePersonalChatByUserID = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const { userId2 } = req.params;

    const personalChat = await PersonalChat.findOneAndUpdate(
        {
            $or: [
                { user1: userId, user2: userId2 },
                { user1: userId2, user2: userId },
            ],
        },
        {
            $set: {
                [`user${userId === userId2 ? 1 : 2}HasArchivedChat`]: true,
            },
        },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: personalChat,
    });
});

export const getChatMessagesByChatId = catchAsync(async (req, res) => {
    const { chatId } = req.params;

    const messages = await PersonalMessage.find({
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
