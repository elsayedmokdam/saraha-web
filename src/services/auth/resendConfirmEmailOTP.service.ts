import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/resend-confirm-email-otp";

/** Sends a fresh confirmation OTP (the API refuses while the previous one is still valid). */
export const resendConfirmEmailOTPService = async (payload: {
  email: string;
}): Promise<HttpResult<ApiResponse>> => {
  return httpClient.post<ApiResponse>(`${BASE_URL}${ROUTE_URL}`, payload);
};
