/**
 * The API stores uploads as `./assets/<folder>/<uuid>.<ext>` and serves them from `GET /assets/**`.
 * `next.config.ts` proxies `/media/**` to that folder, so the browser can load them same-origin.
 * Google avatars are already absolute URLs and are returned untouched.
 *
 * Backend assets are proxied through Next.js to keep requests same-origin.
 * External avatars (Google, etc.) are returned untouched.
 */
export function assetUrl(path?: string | null): string | null {
  if (!path) return null;

  // Keep external URLs untouched unless they point to backend assets.
  if (/^https?:\/\//i.test(path)) {
    const url = new URL(path);

    if (url.pathname.startsWith("/assets/")) {
      return `/media/${url.pathname.slice("/assets/".length)}${url.search}`;
    }

    return path;
  }

  const clean = path
    .replace(/\\/g, "/")
    .replace(/^\.?\/+/, "")
    .replace(/^assets\//, "");

  return `/media/${clean}`;
}
