import { PersonalChat } from "@/models/personal-chat-model";
import { catchAsync } from "@/utils/catch-async";
import { RESPONSE_STATUS } from "@/utils/constants";

export const getAllMyPersonalChats = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const personalChats = await PersonalChat.find({
        $or: [{ user1: userId }, { user2: userId }],
    });

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        data: personalChats,
        results: personalChats.length,
    });
});

export const getPersonalChatByChatId = catchAsync(async (req, res) => {
    // const userId = req.user._id;
    const { chatId } = req.params;

    const personalChat = await PersonalChat.findById(chatId);

    if (!personalChat) {
        return res.status(404).json({
            status: RESPONSE_STATUS.FAIL,
            message: "Personal chat not found",
        });
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
