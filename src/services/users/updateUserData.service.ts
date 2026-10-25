import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { sanitizeUser, UpdateUserDataPayload, User } from "../types/user_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/user/update-data";

/**
 * Update the logged-in user's data (PUT).
 * The API's schema is strict: `username` ("First Last"), `email` and `phone` are required, `DOB` / `gender` optional.
 * (`role` is accepted by the API too, but it is deliberately never sent from the UI.)
 */
export const updateUserDataService = async (
  payload: UpdateUserDataPayload,
): Promise<HttpResult<ApiResponse<User>>> => {
  const token = await getAccessToken();

  const res = await httpClient.put<ApiResponse<User>>(`${BASE_URL}${ROUTE_URL}`, payload, {
    requiredAuthToken: true,
    token,
  });
  if (!res.ok) return res;
  return { ok: true, data: { ...res.data, data: sanitizeUser(res.data.data) } };
};
