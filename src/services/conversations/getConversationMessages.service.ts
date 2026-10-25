import { BASE_URL } from "../config";
import { ApiResponse, Paginated, PaginationParams } from "../types/api_interface";
import { ConversationMessage } from "../types/message_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/conversation";

export interface GetConversationMessagesParams extends PaginationParams {
  search?: string;
}

/** Get the messages of a conversation, newest first. */
export const getConversationMessagesService = async (
  conversationId: string,
  params: GetConversationMessagesParams = {},
): Promise<HttpResult<ApiResponse<Paginated<ConversationMessage>>>> => {
  const token = await getAccessToken();

  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "") as [
      string,
      string,
    ][],
  ).toString();

  return httpClient.get<ApiResponse<Paginated<ConversationMessage>>>(
    `${BASE_URL}${ROUTE_URL}/${conversationId}/messages${query ? `?${query}` : ""}`,
    { requiredAuthToken: true, token },
  );
};
