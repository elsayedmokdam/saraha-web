import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { LoginPayload, TokenPair } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/login";

/**
 * Login with email + password.
 * @returns the access token + refresh token pair
 */
export const loginService = async (
  payload: LoginPayload,
): Promise<HttpResult<ApiResponse<TokenPair>>> => {
  return httpClient.post<ApiResponse<TokenPair>>(
    `${BASE_URL}${ROUTE_URL}`,
    payload,
  );
};
