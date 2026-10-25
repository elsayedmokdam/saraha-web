import { assetUrl } from "@/services/utils/helpers/assetUrl";

interface UserAvatarProps {
  name?: string;
  image?: string | null;
  className?: string;
}

/** Profile picture (API upload or Google avatar) with an initials fallback. */
export default function UserAvatar({
  name = "?",
  image,
  className = "size-10",
}: UserAvatarProps) {
  const src = assetUrl(image);
  const displayName = typeof name === "string" ? name : "?";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "";

  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={displayName}
      referrerPolicy="no-referrer"
      className={`${className} rounded-full object-cover border border-border`}
    />
  ) : (
    <div
      className={`${className} rounded-full bg-main-color/15 text-main-color font-bold flex items-center justify-center shrink-0`}
    >
      {initials || "?"}
    </div>
  );
}
