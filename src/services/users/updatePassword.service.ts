import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { UpdatePasswordPayload } from "../types/user_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/user/update-password";

/**
 * Change the password (PATCH). 409 "Invalid Password" when `currentPassword` is wrong.
 * The API answers with the user document (password hashes included): it is dropped here.
 */
export const updatePasswordService = async (
  payload: UpdatePasswordPayload,
): Promise<HttpResult<ApiResponse>> => {
  const token = await getAccessToken();

  const res = await httpClient.patch<ApiResponse<unknown>>(
    `${BASE_URL}${ROUTE_URL}`,
    payload,
    { requiredAuthToken: true, token },
  );
  if (!res.ok) return res;
  return { ok: true, data: { ...res.data, data: undefined } };
};
