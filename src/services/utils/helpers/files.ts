export const IMAGE_MIME_TYPES = ["image/jpeg", "image/png"] as const;

/**
 * Client-side mirror of the API's upload rules
 * (profile / message: 10MB, up to 3 files - conversation: 20MB, up to 5 files - JPEG & PNG only).
 */
export function validateImageFile(file: File, maxSizeMB: number): string | null {
  if (!(IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
    return `"${file.name}" is not allowed. Only JPEG and PNG images are supported.`;
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `"${file.name}" is larger than ${maxSizeMB}MB.`;
  }
  return null;
}
