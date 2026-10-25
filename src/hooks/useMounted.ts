"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** `false` on the server and during hydration, `true` afterwards (hydration-safe, no effect needed). */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
