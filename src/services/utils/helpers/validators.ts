import type { HttpResult } from "../http";

/** 24 hex chars: the API answers 500 (CastError) on malformed ids, so ids are checked before calling it. */
export const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

export const invalidIdResult = (): HttpResult<never> => ({
  ok: false,
  error: { message: "Invalid id format", status: 400 },
});
