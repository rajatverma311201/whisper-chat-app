import * as AuthController from "@/controllers/auth-controller";
import * as GroupChatController from "@/controllers/group-chat-controller";
import { Router } from "express";

const router = Router();

router.use(AuthController.protect);

router.route("/with-users").post(GroupChatController.createGroupChatWithUsers);
