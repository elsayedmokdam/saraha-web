"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { HttpResult } from "../utils/http";

export async function pingAction(): Promise<HttpResult<{ message: string }>> {
  return $SERVICE_REPOSITORY.System.ping();
}
