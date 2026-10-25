import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { LogoutAction, LogoutEnum } from "../types/enums";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/logout";

/**
 * Revokes the current token (`action: 0`) or every token of the user (`action: 1`).
 * Requires the access token.
 */
export const logoutService = async (
  action: LogoutAction = LogoutEnum.ONE,
): Promise<HttpResult<ApiResponse>> => {
  const token = await getAccessToken();

  return httpClient.post<ApiResponse>(
    `${BASE_URL}${ROUTE_URL}`,
    { action },
    { requiredAuthToken: true, token },
  );
};
