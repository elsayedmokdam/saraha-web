import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { LoginPayload } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/2fa/login";

/** Step 1 of two-step verification: checks the credentials and emails an OTP (no tokens yet). */
export const twoFALoginService = async (
  payload: LoginPayload,
): Promise<HttpResult<ApiResponse>> => {
  return httpClient.post<ApiResponse>(`${BASE_URL}${ROUTE_URL}`, payload);
};
