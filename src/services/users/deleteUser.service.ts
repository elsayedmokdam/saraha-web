import { BASE_URL } from "../config";
import type { ApiResponse } from "../types/api_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, type HttpResult } from "../utils/http";

export const ROUTE_URL = "/user";

/** Admin only. */
export async function deleteUserService(
  userId: string,
): Promise<HttpResult<ApiResponse<unknown>>> {
  const token = await getAccessToken();

  return httpClient.delete<ApiResponse<unknown>>(
    `${BASE_URL}${ROUTE_URL}/${encodeURIComponent(userId)}/delete-user`,
    { requiredAuthToken: true, token },
  );
}
