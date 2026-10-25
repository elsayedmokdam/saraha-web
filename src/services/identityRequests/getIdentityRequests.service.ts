import { BASE_URL } from "../config";
import { ApiResponse, Paginated, PaginationParams } from "../types/api_interface";
import { IdentityRequest } from "../types/message_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/message/identity-request";

/**
 * List the identity requests that were sent TO me (i.e. people asking me to reveal myself).
 *
 * NOTE: the API computes `meta.total` over the whole collection, so `meta.totalPages` is unreliable here.
 * Use `count < limit` to detect the last page.
 */
export const getIdentityRequestsService = async (
  params: PaginationParams = {},
): Promise<HttpResult<ApiResponse<Paginated<IdentityRequest>>>> => {
  const token = await getAccessToken();

  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "") as [
      string,
      string,
    ][],
  ).toString();

  return httpClient.get<ApiResponse<Paginated<IdentityRequest>>>(
    `${BASE_URL}${ROUTE_URL}${query ? `?${query}` : ""}`,
    { requiredAuthToken: true, token },
  );
};
