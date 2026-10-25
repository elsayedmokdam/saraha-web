"use client";

import { useMemo, useRef } from "react";
import { FiImage, FiX } from "react-icons/fi";
import { notify } from "@/services/utils/helpers/alerts";
import { validateImageFile } from "@/services/utils/helpers/files";

interface AttachmentPickerProps {
  files: File[];
  onChange: (files: File[]) => void;
  /** messages: 3 - conversation: 5 */
  maxFiles: number;
  /** messages / profile: 10 - conversation: 20 */
  maxSizeMB: number;
}

/** Image picker with previews that applies the API's upload rules (JPEG/PNG, size and count limits). */
export default function AttachmentPicker({
  files,
  onChange,
  maxFiles,
  maxSizeMB,
}: AttachmentPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";

    const accepted: File[] = [];
    for (const file of picked) {
      const problem = validateImageFile(file, maxSizeMB);
      if (problem) {
        notify.error(problem);
        continue;
      }
      accepted.push(file);
    }

    const next = [...files, ...accepted];
    if (next.length > maxFiles) {
      notify.error(`Maximum ${maxFiles} images allowed`);
    }
    onChange(next.slice(0, maxFiles));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {previews.map(({ file, url }, index) => (
          <div key={`${file.name}-${index}`} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={file.name}
              className="size-20 rounded-lg object-cover border border-border"
            />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange(files.filter((_, i) => i !== index))}
              className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-red-500 text-white cursor-pointer"
            >
              <FiX size={14} />
            </button>
          </div>
        ))}

        {files.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex size-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-xs text-muted-foreground hover:border-main-color hover:text-main-color transition cursor-pointer"
          >
            <FiImage size={20} />
            Add image
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple={maxFiles > 1}
        hidden
        onChange={handlePick}
      />
      <p className="mt-2 text-xs text-muted-foreground/70">
        JPEG or PNG, up to {maxFiles} {maxFiles === 1 ? "image" : "images"}, {maxSizeMB}MB each.
      </p>
    </div>
  );
}
