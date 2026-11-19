
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
