import { BASE_URL } from "../config";
import { ApiResponse, Paginated, PaginationParams } from "../types/api_interface";
import { Conversation } from "../types/message_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/conversation/user";

/**
 * Get every conversation the logged-in user takes part in (as the requester OR as the one who revealed).
 *
 * NOTE: the controller does not forward `req.query` to `find()`, so for now the API always answers
 * page 1 with 10 items, unsorted. `page` / `limit` are still sent so pagination starts working the day
 * the API forwards them.
 */
export const getUserConversationsService = async (
  params: PaginationParams = {},
): Promise<HttpResult<ApiResponse<Paginated<Conversation>>>> => {
  const token = await getAccessToken();

  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "") as [
      string,
      string,
    ][],
  ).toString();

  return httpClient.get<ApiResponse<Paginated<Conversation>>>(
    `${BASE_URL}${ROUTE_URL}${query ? `?${query}` : ""}`,
    { requiredAuthToken: true, token },
  );
};
