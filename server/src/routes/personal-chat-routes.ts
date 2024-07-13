import { Router } from "express";
import * as AuthController from "@/controllers/auth-controller";
import * as PersonalChatController from "@/controllers/personal-chat-controller";

const router = Router();

router.use(AuthController.protect);

router.get("/chats", PersonalChatController.getAllMyPersonalChats);
router.post("/chats", PersonalChatController.createPersonalChatByUserId);

export { router as personalChatRouter };
