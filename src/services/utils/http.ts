import { headers as getRequestHeaders } from "next/headers";
import { API_LANGUAGE } from "../config";

export interface HttpConfig {
  successMessage?: string;
  withCredentials?: boolean;
  timeout?: number;
  requiredAuthToken?: boolean;
  token?: string;
  /** "0" = English, "1" = Arabic (maps to the API's LanguageEnum) */
  language?: "0" | "1";
}

export interface HttpErrorShape {
  message: string;
  status: number;
  /** Validation messages sent by the API in `issues` */
  issues?: string[];
  data?: any;
  statusText?: string;
}

export type HttpResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: HttpErrorShape };

const DEFAULT_CONFIG: Required<HttpConfig> = {
  successMessage: "",
  withCredentials: false,
  timeout: 30000,
  requiredAuthToken: false,
  token: "",
  language: API_LANGUAGE,
};

async function createHeaders(
  options: RequestInit,
  config: Required<HttpConfig>,
): Promise<Headers> {
  const headers = new Headers(options.headers || {});

  // Content-Type (never set it for FormData: fetch must add the multipart boundary itself)
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!headers.has("Content-Type") && options.body && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  // The API rejects any value other than "0" | "1" (see API_LANGUAGE)
  headers.set("Accept-Language", config.language);

  // Auth Token => `Authorization: Bearer <jwt>`
  if (config.requiredAuthToken && config.token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${config.token}`);
  }

  const requestHeaders = await getRequestHeaders();
  const forwardedIp =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip")?.trim();
  if (forwardedIp && !headers.has("x-forwarded-for")) {
    headers.set("x-forwarded-for", forwardedIp);
  }

  return headers;
}

async function parseResponse<T>(res: Response): Promise<T> {
  try {
    return await res.json();
  } catch {
    return {} as T;
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "Bad request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
  422: "Validation error",
  429: "Too many requests, please try again later",
  500: "Server error",
};

function buildError(err: any, res?: Response, data?: any): HttpErrorShape {
  if (err?.name === "AbortError") {
    return { message: "Request timeout", status: 408 };
  }

  if (res) {
    const issues: string[] | undefined = Array.isArray(data?.issues)
      ? data.issues.filter((i: unknown) => typeof i === "string")
      : undefined;

    return {
      message:
        data?.message || STATUS_MESSAGES[res.status] || "Something went wrong",
      status: res.status,
      issues: issues?.length ? issues : undefined,
      data,
      statusText: res.statusText,
    };
  }

  return {
    message: err?.message || "Network error",
    status: 0,
  };
}

export async function http<T = any>(
  url: string,
  options: RequestInit = {},
  config: HttpConfig = {},
): Promise<HttpResult<T>> {
  const merged = { ...DEFAULT_CONFIG, ...config };

  // Do not even call the API when a protected endpoint has no token
  if (merged.requiredAuthToken && !merged.token) {
    return {
      ok: false,
      error: { message: "Please sign in to continue", status: 401 },
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), merged.timeout);

  try {
    const headers = await createHeaders(options, merged);

    const res = await fetch(url, {
      cache: "no-store",
      ...options,
      headers,
      signal: controller.signal,
      credentials: merged.withCredentials ? "include" : "same-origin",
    });

    const data = await parseResponse<T>(res);

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        ok: false,
        error: buildError(null, res, data),
      };
    }

    return {
      ok: true,
      data,
    };
  } catch (err) {
    clearTimeout(timeoutId);

    return {
      ok: false,
      error: buildError(err),
    };
  }
}

const jsonBody = (data?: unknown) =>
  data === undefined ? undefined : JSON.stringify(data);

export const httpClient = {
  get: <T>(url: string, config?: HttpConfig) =>
    http<T>(url, { method: "GET" }, config),

  post: <T>(url: string, data?: unknown, config?: HttpConfig) =>
    http<T>(url, { method: "POST", body: jsonBody(data) }, config),

  put: <T>(url: string, data?: unknown, config?: HttpConfig) =>
    http<T>(url, { method: "PUT", body: jsonBody(data) }, config),

  patch: <T>(url: string, data?: unknown, config?: HttpConfig) =>
    http<T>(url, { method: "PATCH", body: jsonBody(data) }, config),

  delete: <T>(url: string, config?: HttpConfig) =>
    http<T>(url, { method: "DELETE" }, config),

  /** multipart/form-data upload (POST) */
  postForm: <T>(url: string, form: FormData, config?: HttpConfig) =>
    http<T>(url, { method: "POST", body: form }, config),

  /** multipart/form-data upload (PATCH) */
  patchForm: <T>(url: string, form: FormData, config?: HttpConfig) =>
    http<T>(url, { method: "PATCH", body: form }, config),
};
