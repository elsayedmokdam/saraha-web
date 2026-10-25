import { createMessageService } from "./createMessage.service";
import { getMessagesService } from "./getMessages.service";
import { deleteMessageService } from "./deleteMessage.service";

export const MessagesRepo = {
  createMessage: createMessageService,
  getMessages: getMessagesService,
  deleteMessage: deleteMessageService,
};
