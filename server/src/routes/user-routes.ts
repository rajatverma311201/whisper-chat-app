import * as UserController from "@/controllers/user-controller";
import { Router } from "express";
const router = Router();

router.route("/").get(UserController.getAllUsers);
router.patch("/update-my-profile", UserController.updateUserProfileDetails);

export { router as userRouter };
