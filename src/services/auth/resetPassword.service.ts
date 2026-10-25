import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { ResetPasswordPayload } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/reset-password";

/** Step 3 of the reset flow: sets the new password (also logs the user out of every device). */
export const resetPasswordService = async (
  payload: ResetPasswordPayload,
): Promise<HttpResult<ApiResponse>> => {
  const res = await httpClient.patch<ApiResponse<unknown>>(
    `${BASE_URL}${ROUTE_URL}`,
    payload,
  );
  if (!res.ok) return res;
  return { ok: true, data: { ...res.data, data: undefined } };
};
