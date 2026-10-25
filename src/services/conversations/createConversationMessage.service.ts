import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { ConversationMessage } from "../types/message_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/conversation";

/**
 * Send a message inside a conversation. Up to 5 JPEG/PNG images, 20MB each.
 * `content` is required (the API's model rejects a message without text).
 */
export const createConversationMessageService = async (
  conversationId: string,
  formData: FormData,
): Promise<HttpResult<ApiResponse<ConversationMessage[]>>> => {
  const token = await getAccessToken();

  const body = new FormData();
  const content = String(formData.get("content") ?? "").trim();
  if (content) body.append("content", content);

  for (const entry of formData.getAll("attachments")) {
    if (typeof entry !== "string" && entry.size > 0) {
      body.append("attachments", entry, entry.name);
    }
  }

  return httpClient.postForm<ApiResponse<ConversationMessage[]>>(
    `${BASE_URL}${ROUTE_URL}/${conversationId}/messages`,
    body,
    { requiredAuthToken: true, token, timeout: 90000 },
  );
};
