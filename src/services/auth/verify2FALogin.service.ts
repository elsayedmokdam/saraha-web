import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { EmailOtpPayload, TokenPair } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/2fa/verify-otp";

/** Step 2 of two-step verification: exchanges the emailed OTP for the token pair. */
export const verify2FALoginService = async (
  payload: EmailOtpPayload,
): Promise<HttpResult<ApiResponse<TokenPair>>> => {
  return httpClient.post<ApiResponse<TokenPair>>(
    `${BASE_URL}${ROUTE_URL}`,
    payload,
  );
};
