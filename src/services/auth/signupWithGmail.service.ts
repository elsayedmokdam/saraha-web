import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { TokenPair } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/signup-with-gmail";

/**
 * Signup (201) or login (200) with a Google ID token.
 * The token's audience must be one of the API's `WEB_CLIENT_IDs`.
 */
export const signupWithGmailService = async (payload: {
  idToken: string;
}): Promise<HttpResult<ApiResponse<TokenPair>>> => {
  return httpClient.post<ApiResponse<TokenPair>>(
    `${BASE_URL}${ROUTE_URL}`,
    payload,
  );
};
