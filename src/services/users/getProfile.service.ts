import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { sanitizeUser, User } from "../types/user_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/user/profile";

/**
 * Get the logged-in user's profile.
 * @param {string} [tokenOverride] - used by NextAuth right after login, when the session cookie does not exist yet
 */
export const getProfileService = async (
  tokenOverride?: string,
): Promise<HttpResult<ApiResponse<User>>> => {
  const token = tokenOverride ?? (await getAccessToken());

  const res = await httpClient.get<ApiResponse<User>>(`${BASE_URL}${ROUTE_URL}`, {
    requiredAuthToken: true,
    token,
  });
  if (!res.ok) return res;
  return { ok: true, data: { ...res.data, data: sanitizeUser(res.data.data) } };
};
