import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/forgot-password";

/** Step 1 of the reset flow: emails a reset OTP to a confirmed account. */
export const forgotPasswordService = async (payload: {
  email: string;
}): Promise<HttpResult<ApiResponse>> => {
  return httpClient.post<ApiResponse>(`${BASE_URL}${ROUTE_URL}`, payload);
};
