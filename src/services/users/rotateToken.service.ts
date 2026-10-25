import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { TokenPair } from "../types/auth_interface";
import { sanitizeUser, User } from "../types/user_interface";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/user/rotate-token";

/**
 * Exchanges the REFRESH token for a new token pair.
 * The API only allows it during the last 10 minutes of the access token life (409 "Access token is still valid" otherwise).
 *
 * Unlike every other protected endpoint this one needs the refresh token in the `Authorization` header.
 * It is called by NextAuth's `jwt` callback, so the token is passed in explicitly.
 */
export const rotateTokenService = async (
  refreshToken: string,
): Promise<
  HttpResult<ApiResponse<TokenPair & { user?: User }>>
> => {
  const res = await httpClient.post<ApiResponse<TokenPair & { user?: User }>>(
    `${BASE_URL}${ROUTE_URL}`,
    undefined,
    { requiredAuthToken: true, token: refreshToken },
  );
  if (!res.ok) return res;
  const { user, ...tokens } = res.data.data ?? ({} as any);
  return {
    ok: true,
    data: {
      ...res.data,
      data: { ...tokens, user: user ? sanitizeUser(user) : undefined },
    },
  };
};
