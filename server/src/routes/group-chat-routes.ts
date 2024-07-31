import * as AuthController from "@/controllers/auth-controller";
import * as GroupChatController from "@/controllers/group-chat-controller";
import { Router } from "express";

const router = Router();

router.use(AuthController.protect);

router.route("/").get(GroupChatController.getAllGroupChatsOfUser);

router
    .route("/:groupId/members")
    .get(GroupChatController.getAllMembersOfGroupChat);
router.route("/with-users").post(GroupChatController.createGroupChatWithUsers);

export { router as groupChatRouter };
