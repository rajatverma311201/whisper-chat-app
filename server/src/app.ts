import express, { Express, Request, Response } from "express";
import { authRouter } from "@/routes/auth-routes";
import { userRouter } from "@/routes/user-routes";
import { User } from "./models/user-model";
import morgan from "morgan";
const app: Express = express();
app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

export default app;
