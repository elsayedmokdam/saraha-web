/**
 * The API stores uploads as `./assets/<folder>/<uuid>.<ext>` and serves them from `GET /assets/**`.
 * `next.config.ts` proxies `/media/**` to that folder, so the browser can load them same-origin.
 * Google avatars are already absolute URLs and are returned untouched.
 */
export function assetUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
    
  if (process.env.NEXT_PUBLIC_API_URL?.includes("localhost")) {
    const clean = path
      .replace(/\\/g, "/")
      .replace(/^\.?\/+/, "")
      .replace(/^assets\//, "");

    return `/media/${clean}`;
  }

  return `${process.env.NEXT_PUBLIC_API_URL}/${path.replace(/^\.?\/+/, "")}`;
}
