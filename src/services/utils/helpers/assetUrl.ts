
export function assetUrl(path?: string | null): string | null {
  if (!path) return null;

  return `${process.env.NEXT_PUBLIC_API_URL}/${path.replace(/^\.?\/+/, "")}`;
}
