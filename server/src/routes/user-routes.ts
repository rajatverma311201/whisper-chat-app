import * as UserController from "@/controllers/user-controller";
import { Router } from "express";
const router = Router();

router.route("/").get(UserController.getAllUsers);

export { router as userRouter };
