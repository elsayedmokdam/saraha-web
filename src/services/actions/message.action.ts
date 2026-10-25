"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { ApiResponse, Paginated } from "../types/api_interface";
import { Message, DeleteResult } from "../types/message_interface";
import { GetMessagesParams } from "../messages/getMessages.service";
import { validateImageFile } from "../utils/helpers/files";
import { invalidIdResult, isObjectId } from "../utils/helpers/validators";
import { HttpResult } from "../utils/http";

/** `formData`: `receiverId`, `content?`, `attachments?` (max 3 images, 10MB each) */
export async function createMessageAction(
  formData: FormData,
): Promise<HttpResult<ApiResponse<Message[]>>> {
  if (!isObjectId(String(formData.get("receiverId") ?? "").trim())) {
    return invalidIdResult();
  }

  const files = formData
    .getAll("attachments")
    .filter((f): f is File => typeof f !== "string" && f.size > 0);

  if (files.length > 3) {
    return { ok: false, error: { message: "Maximum 3 files allowed", status: 400 } };
  }
  for (const file of files) {
    const problem = validateImageFile(file, 10);
    if (problem) return { ok: false, error: { message: problem, status: 400 } };
  }

  return $SERVICE_REPOSITORY.Messages.createMessage(formData);
}

export async function getMessagesAction(
  params: GetMessagesParams = {},
): Promise<HttpResult<ApiResponse<Paginated<Message>>>> {
  return $SERVICE_REPOSITORY.Messages.getMessages(params);
}

export async function deleteMessageAction(
  messageId: string,
): Promise<HttpResult<ApiResponse<DeleteResult>>> {
  if (!isObjectId(messageId)) return invalidIdResult();
  return $SERVICE_REPOSITORY.Messages.deleteMessage(messageId);
}
