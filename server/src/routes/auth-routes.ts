import * as AuthController from "@/controllers/auth-controller";
import { Router } from "express";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);

router.get(
    "/get-current-user",
    AuthController.isLoggedIn,
    AuthController.getCurrentUser
);

export { router as authRouter };
