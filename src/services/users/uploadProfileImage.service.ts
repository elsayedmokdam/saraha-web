import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { sanitizeUser, User } from "../types/user_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/user/profile-image";

/**
 * Upload / replace the profile image (JPEG or PNG, max 10MB).
 * The API requires the multipart field to be called exactly `attachment`.
 */
export const uploadProfileImageService = async (
  file: File,
): Promise<HttpResult<ApiResponse<User>>> => {
  const token = await getAccessToken();

  const form = new FormData();
  form.append("attachment", file, file.name);

  const res = await httpClient.patchForm<ApiResponse<User>>(
    `${BASE_URL}${ROUTE_URL}`,
    form,
    { requiredAuthToken: true, token, timeout: 60000 },
  );
  if (!res.ok) return res;
  return { ok: true, data: { ...res.data, data: sanitizeUser(res.data.data) } };
};
