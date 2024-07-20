import { User } from "@/models/user-model";
import { catchAsync } from "@/utils/catch-async";

export const getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find().select("name email role photo");
    res.status(200).json({
        status: "success",
        results: users.length,
        data: users,
    });
});
