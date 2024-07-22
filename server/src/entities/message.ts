import { MessageModel } from "@/models/message-model";

export class Message {
    msgDoc?: IMessage;

    constructor(params: IMessage) {
        this.msgDoc = new MessageModel(params);
    }

    // createMessage(params: IMessage) {
    //     this.msgDoc = new MessageModel(params);
    //     return this;
    // }

    async saveMessageToDB() {
        this.msgDoc?.save();
    }
}
