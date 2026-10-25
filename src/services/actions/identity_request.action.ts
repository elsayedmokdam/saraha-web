"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { ApiResponse, Paginated, PaginationParams } from "../types/api_interface";
import {
  IdentityRequest,
  RespondIdentityRequestResult,
} from "../types/message_interface";
import { invalidIdResult, isObjectId } from "../utils/helpers/validators";
import { HttpResult } from "../utils/http";

export async function createIdentityRequestAction(
  messageId: string,
): Promise<HttpResult<ApiResponse<IdentityRequest[]>>> {
  if (!isObjectId(messageId)) return invalidIdResult();
  return $SERVICE_REPOSITORY.IdentityRequests.createIdentityRequest(messageId);
}

export async function respondToIdentityRequestAction(
  requestId: string,
  status: "accepted" | "rejected",
): Promise<HttpResult<ApiResponse<RespondIdentityRequestResult>>> {
  if (!isObjectId(requestId)) return invalidIdResult();
  if (status !== "accepted" && status !== "rejected") {
    return { ok: false, error: { message: "Invalid status", status: 400 } };
  }
  return $SERVICE_REPOSITORY.IdentityRequests.respondToIdentityRequest(
    requestId,
    status,
  );
}

export async function getIdentityRequestsAction(
  params: PaginationParams = {},
): Promise<HttpResult<ApiResponse<Paginated<IdentityRequest>>>> {
  return $SERVICE_REPOSITORY.IdentityRequests.getIdentityRequests(params);
}
