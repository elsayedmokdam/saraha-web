import { BASE_URL } from "../config";
import { ApiResponse } from "../types/api_interface";
import { DeleteResult } from "../types/message_interface";
import { getAccessToken } from "../utils/helpers/getMyToken";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/message";

/** Delete a message. Only its RECEIVER can delete it (404 otherwise). */
export const deleteMessageService = async (
  messageId: string,
): Promise<HttpResult<ApiResponse<DeleteResult>>> => {
  const token = await getAccessToken();

  return httpClient.delete<ApiResponse<DeleteResult>>(
    `${BASE_URL}${ROUTE_URL}/${messageId}`,
    { requiredAuthToken: true, token },
  );
};
