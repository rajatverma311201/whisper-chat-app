import { GroupChat } from "@/models/group-chat-model";
import { catchAsync } from "@/utils/catch-async";

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
