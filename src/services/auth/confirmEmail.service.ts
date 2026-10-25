import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { EmailOtpPayload } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/confirm-email";

/** Confirms the email address with the OTP that was emailed after signup. */
export const confirmEmailService = async (
  payload: EmailOtpPayload,
): Promise<HttpResult<ApiResponse>> => {
  const res = await httpClient.patch<ApiResponse<unknown>>(
    `${BASE_URL}${ROUTE_URL}`,
    payload,
  );
  if (!res.ok) return res;
  // the API returns the user document (with password hashes) - never forward it
  return { ok: true, data: { ...res.data, data: undefined } };
};
