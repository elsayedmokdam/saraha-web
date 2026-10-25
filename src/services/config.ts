/** Base URL of the Saraha API (no trailing slash). */
export const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

/**
 * The API validates the `Accept-Language` header and only accepts "0" (English) or "1" (Arabic).
 * Node's fetch sends `*` and browsers send `en-US,...`, both of which the API rejects with a 400,
 * so the HTTP client ALWAYS sends this value explicitly.
 */
export const API_LANGUAGE: "0" | "1" = "0";

/** The API only lets you rotate the token during the last 10 minutes of the access-token life. */
export const ROTATE_WINDOW_MS = 10 * 60 * 1000;
