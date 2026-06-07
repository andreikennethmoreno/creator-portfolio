"use client";

import { ThemeProvider as CustomThemeProvider } from "@/lib/theme-context";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: string;
  defaultTheme?: "light" | "dark";
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <CustomThemeProvider {...props}>{children}</CustomThemeProvider>;
}
