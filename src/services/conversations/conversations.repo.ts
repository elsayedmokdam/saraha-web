import { createConversationMessageService } from "./createConversationMessage.service";
import { getConversationMessagesService } from "./getConversationMessages.service";
import { getUserConversationsService } from "./getUserConversations.service";

export const ConversationsRepo = {
  getUserConversations: getUserConversationsService,
  createMessage: createConversationMessageService,
  getMessages: getConversationMessagesService,
};
