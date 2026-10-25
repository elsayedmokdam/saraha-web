import { BASE_URL } from "../config";
import type {
  ApiResponse,
  Paginated,
  PaginationParams,
} from "../types/api_interface";
import type { User } from "../types/user_interface";
import { sanitizeUser } from "../types/user_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, type HttpResult } from "../utils/http";

export const ROUTE_URL = "/user/all";

/** Admin only. Lists every user except the caller. */
export const getAllUsersService = async (
  params: PaginationParams = {},
): Promise<
  HttpResult<ApiResponse<Paginated<User>>>
> => {
  const token = await getAccessToken();
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "") as [
      string,
      string,
    ][],
  ).toString();

  const res = await httpClient.get<ApiResponse<Paginated<User>>>(
    `${BASE_URL}${ROUTE_URL}${query ? `?${query}` : ""}`,
    {
      requiredAuthToken: true,
      token,
    },
  );

  if (!res.ok) return res;

  return {
    ok: true,
    data: {
      ...res.data,
      data: {
        ...res.data.data,
        data: (res.data.data.data ?? []).map(sanitizeUser),
      },
    },
  };
};
