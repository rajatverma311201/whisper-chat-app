import { Schema, model } from "mongoose";

const notificationSchema = new Schema({});

export const Notification = model("Notification", notificationSchema);
