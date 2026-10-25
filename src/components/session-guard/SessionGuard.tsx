"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { notify } from "@/services/utils/helpers/alerts";

/**
 * Watches the NextAuth session:
 *  - `session.error`  => the API session cannot be refreshed any more: sign out and go to /signin
 *  - `rotatedAt`      => tokens were rotated in the background: refresh server components so they use the new token
 */
export default function SessionGuard({
  sessionExpired = false,
}: {
  sessionExpired?: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const error = session?.error;
  const rotatedAt = session?.rotatedAt;
  const isExpired = sessionExpired || !!error;

  useEffect(() => {
    if (!isExpired) return;
    notify.error("Your session has expired. Please sign in again.");
    signOut({ redirect: false }).then(() => {
      router.push("/signin");
      router.refresh();
    });
  }, [isExpired, router]);

  useEffect(() => {
    if (rotatedAt) router.refresh();
  }, [rotatedAt, router]);

  return null;
}
