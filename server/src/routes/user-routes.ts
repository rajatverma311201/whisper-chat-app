import { Router } from "express";
import { protect as AuthProtect } from "@/controllers/auth-controller";

const router = Router();

export { router as userRouter };
