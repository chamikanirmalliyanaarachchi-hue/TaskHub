"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Thin wrapper around next-themes so the rest of the app can simply use
 * <ThemeProvider> and then call useTheme() anywhere to read/set the mode.
 * Default theme is dark (matches the futuristic aesthetic) and we disable
 * SSR flash via the `suppressHydrationWarning` placed on <html>.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
