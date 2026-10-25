"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { ApiResponse, Paginated, PaginationParams } from "../types/api_interface";
import { Conversation, ConversationMessage } from "../types/message_interface";
import { GetConversationMessagesParams } from "../conversations/getConversationMessages.service";
import { validateImageFile } from "../utils/helpers/files";
import { invalidIdResult, isObjectId } from "../utils/helpers/validators";
import { HttpResult } from "../utils/http";

/** All the conversations of the logged-in user (GET /conversation/user) */
export async function getUserConversationsAction(
  params: PaginationParams = {},
): Promise<HttpResult<ApiResponse<Paginated<Conversation>>>> {
  return $SERVICE_REPOSITORY.Conversations.getUserConversations(params);
}

/** `formData`: `content` (required), `attachments?` (max 5 images, 20MB each) */
export async function createConversationMessageAction(
  conversationId: string,
  formData: FormData,
): Promise<HttpResult<ApiResponse<ConversationMessage[]>>> {
  if (!isObjectId(conversationId)) return invalidIdResult();

  const files = formData
    .getAll("attachments")
    .filter((f): f is File => typeof f !== "string" && f.size > 0);

  if (files.length > 5) {
    return { ok: false, error: { message: "Maximum 5 files allowed", status: 400 } };
  }
  for (const file of files) {
    const problem = validateImageFile(file, 20);
    if (problem) return { ok: false, error: { message: problem, status: 400 } };
  }

  return $SERVICE_REPOSITORY.Conversations.createMessage(conversationId, formData);
}

export async function getConversationMessagesAction(
  conversationId: string,
  params: GetConversationMessagesParams = {},
): Promise<HttpResult<ApiResponse<Paginated<ConversationMessage>>>> {
  if (!isObjectId(conversationId)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Conversations.getMessages(conversationId, params);
}
