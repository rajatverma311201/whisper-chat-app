import "module-alias/register";
import path from "path";

import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "config/config.env") });

import app from "@/app";
import mongoose from "mongoose";
import { socketHandler } from "@/socket";

if (!process.env.DATABASE_URI || !process.env.DATABASE_PASSWORD) {
    throw new Error("DATABASE environment variables error");
}

const DB = process.env.DATABASE_URI.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 9999;

const appHttpServer = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

socketHandler(appHttpServer);
