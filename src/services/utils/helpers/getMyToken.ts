import type { JWT } from "next-auth/jwt";

/**
 * Reads the NextAuth session cookie on the server and returns its decoded payload.
 * The API tokens (`accessToken` / `refreshToken`) live ONLY in this httpOnly cookie, never in the browser's JS.
 *
 * Next's `headers`/`cookies` are imported lazily so the services layer can be imported from any module graph.
 */
export async function getMyToken(): Promise<JWT | null> {
  const { cookies, headers } = await import("next/headers");
  const { getToken } = await import("next-auth/jwt");

  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);

  const decoded = await getToken({
    req: {
      headers: Object.fromEntries(headerStore.entries()),
      // `getToken` also understands chunked session cookies (next-auth.session-token.0, .1, ...)
      cookies: Object.fromEntries(
        cookieStore.getAll().map((c) => [c.name, c.value]),
      ),
    } as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!decoded || !decoded.accessToken || decoded.error) return null;
  return decoded;
}

/** Shortcut used by every protected service. */
export async function getAccessToken(): Promise<string | undefined> {
  const decoded = await getMyToken();
  return decoded?.accessToken;
}
