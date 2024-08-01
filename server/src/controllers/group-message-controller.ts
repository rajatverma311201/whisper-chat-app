import { GroupChat } from "@/models/group-chat-model";
import { GroupMessageModel } from "@/models/group-message-model";
import { AppError } from "@/utils/app-error";
import { catchAsync } from "@/utils/catch-async";

export const createGroupMessage = catchAsync(async (req, res, next) => {
    const { message, chatId } = req.body;

    const chat = await GroupChat.findById(chatId);

    if (!chat) {
        return next(new AppError("Chat not found", 404));
    }

    const newMessage = await GroupMessageModel.create({
        content: message,
        chat: chatId,
        sender: req.user.id,
    });

    res.status(201).json({
        status: "success",
        data: newMessage,
    });
});
