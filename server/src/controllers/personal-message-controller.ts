import { PersonalChat } from "@/models/personal-chat-model";
import { PersonalMessage } from "@/models/personal-message-model";
import { catchAsync } from "@/utils/catch-async";
import { RESPONSE_STATUS } from "@/utils/constants";

export const createMessage = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const { message, chatId } = req.body;

    const personalChat = await PersonalChat.findById(chatId);
    if (!personalChat) {
        return res.status(404).json({
            status: RESPONSE_STATUS.FAIL,
            message: "Personal chat not found",
        });
    }

    if (
        personalChat.user1.toString() !== userId.toString() &&
        personalChat.user2.toString() !== userId.toString()
    ) {
        return res.status(403).json({
            status: RESPONSE_STATUS.FAIL,
            message: "You are not a participant of this chat",
        });
    }

    const receiver =
        userId.toString() === personalChat.user1.toString()
            ? personalChat.user2
            : personalChat.user1;

    const newMessage = await PersonalMessage.create({
        chat: chatId,
        content: message,
        sender: userId,
        receiver,
    });

    res.status(200).json({
        status: RESPONSE_STATUS.SUCCESS,
        message: "createMessage",
        data: newMessage,
    });
});
