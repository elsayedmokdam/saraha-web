import { BASE_URL } from "../config";
import type { ApiResponse } from "../types/api_interface";
import type { AdminUpdateUserPayload } from "../types/user_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, type HttpResult } from "../utils/http";

export const ROUTE_URL = "/user";

/** Admin only. */
export async function updateUserService(
  userId: string,
  payload: AdminUpdateUserPayload,
): Promise<HttpResult<ApiResponse<unknown>>> {
  const token = await getAccessToken();

  return httpClient.put<ApiResponse<unknown>>(
    `${BASE_URL}${ROUTE_URL}/${encodeURIComponent(userId)}/update-user`,
    payload,
    { requiredAuthToken: true, token },
  );
}
