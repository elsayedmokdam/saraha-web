"use client";

import { useCallback, useEffect, useState } from "react";

/** Counts down `seconds` after `start()` is called (used to throttle "Resend code"). */
export function useCooldown(seconds: number) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  const start = useCallback(() => setRemaining(seconds), [seconds]);

  return { remaining, start, active: remaining > 0 };
}
