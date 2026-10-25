import { BASE_URL } from "../config";
import { ApiResponse, Paginated, PaginationParams } from "../types/api_interface";
import { MessageType } from "../types/enums";
import { Message } from "../types/message_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/message";

export interface GetMessagesParams extends PaginationParams {
  /** "0" sent by me, "1" received by me, "2" both (default) */
  type?: MessageType;
  /** case-insensitive match on the message content */
  search?: string;
  /** accepted by the API's schema but ignored by the API (always newest first) */
  sort?: string;
}

/** Get my messages (sent and/or received), newest first. */
export const getMessagesService = async (
  params: GetMessagesParams = {},
): Promise<HttpResult<ApiResponse<Paginated<Message>>>> => {
  const token = await getAccessToken();

  // the API validates the query with a strict schema: send only what is set
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "") as [
      string,
      string,
    ][],
  ).toString();

  return httpClient.get<ApiResponse<Paginated<Message>>>(
    `${BASE_URL}${ROUTE_URL}${query ? `?${query}` : ""}`,
    { requiredAuthToken: true, token },
  );
};
