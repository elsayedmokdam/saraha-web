import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { SignupPayload } from "../types/auth_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/auth/signup";

/**
 * Signup a user. The API then emails a 6-digit OTP that must be confirmed before login.
 * (The API answers with the created user document: it contains password hashes, so it is dropped here.)
 * @param {SignupPayload} payload - username ("First Last"), email, password, confirmPassword, phone, DOB?, gender?
 */
export const signupService = async (
  payload: SignupPayload,
): Promise<HttpResult<ApiResponse>> => {
  const res = await httpClient.post<ApiResponse<unknown>>(
    `${BASE_URL}${ROUTE_URL}`,
    payload,
  );
  if (!res.ok) return res;
  return { ok: true, data: { ...res.data, data: undefined } };
};
