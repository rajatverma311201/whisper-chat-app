import { authRouter } from "@/routes/auth-routes";
import express, { Express, Request, Response } from "express";

import { userRouter } from "@/routes/user-routes";

import cors from "cors";
import morgan from "morgan";

import { personalChatRouter } from "@/routes/personal-chat-routes";
import { personalMessageRouter } from "@/routes/personal-message-routes";
import { globalErrorHandler } from "@/utils/global-error-handler";

const app: Express = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/personal-chats", personalChatRouter);
app.use("/api/personal-messages", personalMessageRouter);

app.use(globalErrorHandler);

export default app;
