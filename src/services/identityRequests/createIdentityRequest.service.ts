import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { IdentityRequest } from "../types/message_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/message";

/**
 * As the RECEIVER of an anonymous message, ask its sender to reveal who they are.
 * (409 "Request Already Sent" when one already exists for the message.)
 */
export const createIdentityRequestService = async (
  messageId: string,
): Promise<HttpResult<ApiResponse<IdentityRequest[]>>> => {
  const token = await getAccessToken();

  return httpClient.post<ApiResponse<IdentityRequest[]>>(
    `${BASE_URL}${ROUTE_URL}/${messageId}/identity-request`,
    undefined,
    { requiredAuthToken: true, token },
  );
};
