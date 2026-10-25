import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { Message } from "../types/message_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/message";

/**
 * Send a message to a user.
 * The API needs `receiverId` + (`content` and/or at least one image). Up to 3 JPEG/PNG images, 10MB each.
 * Optional fields are omitted (not sent empty) because the API validates its body with a strict schema.
 */
export const createMessageService = async (
  formData: FormData,
): Promise<HttpResult<ApiResponse<Message[]>>> => {
  const token = await getAccessToken();

  const body = new FormData();
  const content = String(formData.get("content") ?? "").trim();
  if (content) body.append("content", content);
  body.append("receiverId", String(formData.get("receiverId") ?? "").trim());

  for (const entry of formData.getAll("attachments")) {
    if (typeof entry !== "string" && entry.size > 0) {
      body.append("attachments", entry, entry.name);
    }
  }

  return httpClient.postForm<ApiResponse<Message[]>>(`${BASE_URL}${ROUTE_URL}`, body, {
    requiredAuthToken: true,
    token,
    timeout: 60000,
  });
};
