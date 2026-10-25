import { assetUrl } from "@/services/utils/helpers/assetUrl";

/** Thumbnails of the images attached to a message (opens the full image in a new tab). */
export default function AttachmentGallery({
  attachments = [],
}: {
  attachments?: string[];
}) {
  if (!attachments.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {attachments.map((path) => {
        const src = assetUrl(path);
        if (!src) return null;
        return (
          <a key={path} href={src} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="attachment"
              className="size-24 rounded-lg object-cover border border-border hover:opacity-80 transition"
            />
          </a>
        );
      })}
    </div>
  );
}
