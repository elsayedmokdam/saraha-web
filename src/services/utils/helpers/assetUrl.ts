
export function assetUrl(path?: string | null): string | null {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  return `${process.env.NEXT_PUBLIC_API_URL}/${path.replace(/^\.?\/+/, "")}`;
}
