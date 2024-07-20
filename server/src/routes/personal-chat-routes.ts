import * as AuthController from "@/controllers/auth-controller";
import * as PersonalChatController from "@/controllers/personal-chat-controller";
import { Router } from "express";

const router = Router();

router.use(AuthController.protect);

router.get("/", PersonalChatController.getAllMyPersonalChats);
router.post("/", PersonalChatController.createPersonalChatByUserId);
router
    .route("/:chatId/messages")
    .get(PersonalChatController.getChatMessagesByChatId);

export { router as personalChatRouter };
