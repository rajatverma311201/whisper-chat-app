import * as AuthController from "@/controllers/auth-controller";
import * as UserController from "@/controllers/user-controller";

import { Router } from "express";

const router = Router();

router.use(AuthController.protect);

router.route("/").get(UserController.getAllUsers);
router.patch("/update-my-profile", UserController.updateUserProfileDetails);

export { router as userRouter };
