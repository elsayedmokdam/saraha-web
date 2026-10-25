import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { RespondIdentityRequestResult } from "../types/message_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/message";

/**
 * As the SENDER of the message, accept or reject an identity request.
 * Accepting reveals you, flags the message as not anonymous and creates the conversation.
 */
export const respondToIdentityRequestService = async (
  requestId: string,
  status: "accepted" | "rejected",
): Promise<HttpResult<ApiResponse<RespondIdentityRequestResult>>> => {
  const token = await getAccessToken();

  return httpClient.patch<ApiResponse<RespondIdentityRequestResult>>(
    `${BASE_URL}${ROUTE_URL}/${requestId}/identity-request`,
    { status },
    { requiredAuthToken: true, token },
  );
};
