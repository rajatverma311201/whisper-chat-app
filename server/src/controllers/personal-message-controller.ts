import { PersonalChat } from "@/models/personal-chat-model";
import { PersonalMessage } from "@/models/personal-message-model";
import { AppError } from "@/utils/app-error";
import { catchAsync } from "@/utils/catch-async";
import { MESSAGE_STATUS, RESPONSE_STATUS } from "@/utils/constants";

export const createMessage = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const { message, chatId, userId2 } = req.body;

    let personalChat;

    if (!chatId) {
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
            personalChat = personalChatExists;
        } else {
            personalChat = await PersonalChat.create({
                user1: userId,
                user2: userId2,
            });
        }
    } else {
        personalChat = await PersonalChat.findById(chatId);

        if (!personalChat) {
            return next(new AppError("Personal chat not found", 404));
        }
    }

    const newMessage = await PersonalMessage.create({
        chat: chatId,
        content: message,
        sender: userId,
    });

    console.log(newMessage);

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: "Message Created",
        data: newMessage,
    });
});

export const updateMessageStatusToRead = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const { msgId } = req.params;

    const message = await PersonalMessage.findById(msgId);

    if (!message) {
        return next(new AppError("Message not found", 404));
    }

    if (message.sender.toString() === userId) {
        return next(
            new AppError("You can't mark your own message as seen", 400)
        );
    }

    message.status = MESSAGE_STATUS.READ;

    await message.save();

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: "Message status updated",
        data: message,
    });
});
