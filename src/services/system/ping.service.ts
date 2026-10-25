import { BASE_URL } from "../config";
import { httpClient, HttpResult } from "../utils/http";

export const ROUTE_URL = "/";

/** `ALL /` -> `{ message: "Welcome to DB API 🌸" }` (used as the health check) */
export const pingService = async (): Promise<
  HttpResult<{ message: string }>
> => {
  return httpClient.get<{ message: string }>(`${BASE_URL}${ROUTE_URL}`, {
    timeout: 8000,
  });
};
