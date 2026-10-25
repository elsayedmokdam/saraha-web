"use client";

import { FiCopy, FiLink } from "react-icons/fi";
import { notify } from "@/services/utils/helpers/alerts";

export default function ShareLinkCard({ userId }: { userId: string }) {
  const link = () => `${window.location.origin}/u/${userId}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link());
      notify.success("Link copied!");
    } catch {
      notify.error("Could not copy the link");
    }
  }

  return (
    <div className="rounded-2xl bg-linear-to-br from-main-color to-fuchsia-500 p-6 text-white shadow-lg">
      <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80">
        <FiLink /> Your personal link
      </p>
      <p className="mt-2 text-sm text-white/90">
        Share it so people can send you anonymous messages.
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/15 p-2 ps-4">
        <code className="min-w-0 flex-1 truncate text-sm">/u/{userId}</code>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-semibold text-main-color hover:bg-white/90 cursor-pointer"
        >
          <FiCopy /> Copy
        </button>
      </div>
    </div>
  );
}
