"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Light / dark / system theme.
 * next-themes toggles the `dark` class on <html> (the design tokens in globals.css react to it),
 * stores the choice in localStorage and injects a tiny script so there is no flash on load.
 */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="saraha-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
