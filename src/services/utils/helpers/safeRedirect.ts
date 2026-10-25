/** Only allows same-site relative paths (prevents open redirects through `?callbackUrl=`). */
export function safeRedirect(url?: string | null, fallback = "/"): string {
  if (!url || !url.startsWith("/") || url.startsWith("//")) return fallback;
  return url;
}
