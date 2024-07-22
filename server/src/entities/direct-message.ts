import { DirectMessageModel } from "@/models/direct-message-model";
import { Schema } from "mongoose";
import { Message } from "./message";

export class DirectMessage extends Message {
    directMsgDoc?: IDirectMessage;
    constructor(params: IMessage & IDirectMessage) {
        super(params);
        // this.msg = msg;
    }

    createMessage(params: IMessage) {
        const t = new Message(params);
        return this;
    }

    attachMessageToChat(chatId: Schema.Types.ObjectId) {
        this.directMsgDoc = new DirectMessageModel({
            directChat: chatId,
            msg: this.msg,
        });

        return this;
    }
    updateMessage() {}
    deleteMessage() {}
    getMessages() {}

    async saveMessageToDB() {
        this.directMsgDoc?.save();
        super.saveMessageToDB();
    }
}
