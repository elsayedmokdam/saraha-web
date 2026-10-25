import { BASE_URL } from "../config";
import type { ApiResponse } from "../types/api_interface";
import type { AdminAddUserPayload } from "../types/user_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, type HttpResult } from "../utils/http";

export const ROUTE_URL = "/user/add-user";

/** Admin only. */
export async function addUserService(
  payload: AdminAddUserPayload,
): Promise<HttpResult<ApiResponse<unknown>>> {
  const token = await getAccessToken();

  return httpClient.post<ApiResponse<unknown>>(
    `${BASE_URL}${ROUTE_URL}`,
    payload,
    { requiredAuthToken: true, token },
  );
}
