import { Message } from "@/entities/message";
import { MESSAGE_TYPE } from "@/utils/constants";

export class MessageService {
    messageType: MESSAGE_TYPE = MESSAGE_TYPE.DIRECT;

    constructor(msgType: MESSAGE_TYPE = MESSAGE_TYPE.DIRECT) {
        this.messageType = msgType;
    }

    async createMessage(vals: IMessage) {
        const msgDoc = await new Message()
            .createMessage(vals)
            .saveMessageToDB();
    }
}
