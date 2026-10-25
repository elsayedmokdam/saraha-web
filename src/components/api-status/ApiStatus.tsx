"use client";

import { useEffect, useState } from "react";
import { pingAction } from "@/services/actions/system.action";

/** Pings `GET /` of the API and shows whether it is reachable. */
export default function ApiStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking",
  );

  useEffect(() => {
    let cancelled = false;
    pingAction().then((res) => {
      if (!cancelled) setStatus(res.ok ? "online" : "offline");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const dot =
    status === "online"
      ? "bg-emerald-500"
      : status === "offline"
        ? "bg-red-500"
        : "bg-gray-300 animate-pulse";

  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className={`size-2 rounded-full ${dot}`} />
      API {status === "checking" ? "…" : status}
    </span>
  );
}
