/** Decodes the payload of a JWT *without* verifying it (the API is the one that verifies). */
export interface ApiJwtPayload {
  sub?: string;
  role?: number;
  jti?: string;
  iat?: number;
  exp?: number;
  aud?: (string | number)[];
}

export function decodeJwt(token?: string | null): ApiJwtPayload | null {
  if (typeof token !== "string" || !token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json =
      typeof Buffer !== "undefined"
        ? Buffer.from(part, "base64url").toString("utf8")
        : atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Expiry of the token as a unix timestamp in milliseconds. */
export function getJwtExpiry(token?: string | null): number | undefined {
  const exp = decodeJwt(token)?.exp;
  return exp ? exp * 1000 : undefined;
}
