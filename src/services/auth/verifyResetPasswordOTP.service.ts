import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { EmailOtpPayload } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/verify-reset-password-otp";

/** Step 2 of the reset flow: checks the OTP. */
export const verifyResetPasswordOTPService = async (
  payload: EmailOtpPayload,
): Promise<HttpResult<ApiResponse>> => {
  const res = await httpClient.post<ApiResponse<unknown>>(
    `${BASE_URL}${ROUTE_URL}`,
    payload,
  );
  if (!res.ok) return res;
  return { ok: true, data: { ...res.data, data: undefined } };
};
