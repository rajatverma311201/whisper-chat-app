import { Router } from "express";
import * as AuthController from "@/controllers/auth-controller";
import * as PersonalMessageController from "@/controllers/personal-message-controller";

const router = Router();

router.use(AuthController.protect);

router.post("/messages", PersonalMessageController.createMessage);

export { router as personalMessageRouter };
