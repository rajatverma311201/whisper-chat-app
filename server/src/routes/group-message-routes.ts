import * as AuthController from "@/controllers/auth-controller";
import * as GroupMessageController from "@/controllers/group-message-controller";
import { Router } from "express";

const router = Router();

router.use(AuthController.protect);

router.route("/").post(GroupMessageController.createGroupMessage);
router.route("/:msgId/read");
// .patch(GroupMessageController.updateMessageStatusToRead);

export { router as groupMessageRouter };
