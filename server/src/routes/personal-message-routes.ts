import * as AuthController from "@/controllers/auth-controller";
import * as PersonalMessageController from "@/controllers/personal-message-controller";
import { Router } from "express";

const router = Router();

router.use(AuthController.protect);

router.route("/").post(PersonalMessageController.createMessage);
router.route("/:personalChatId");

export { router as personalMessageRouter };
