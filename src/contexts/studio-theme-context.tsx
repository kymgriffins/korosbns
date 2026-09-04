"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useTheme } from "next-themes";

export type StudioThemeMode = "dark" | "light";

const STORAGE_KEY = "bns-studio-theme";

type StudioThemeContextValue = {
  theme: StudioThemeMode;
  setTheme: (mode: StudioThemeMode) => void;
  toggleTheme: () => void;
};

const StudioThemeContext = createContext<StudioThemeContextValue | null>(null);

export function StudioThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme: setNextTheme } = useTheme();

  const currentTheme: StudioThemeMode = resolvedTheme === "light" ? "light" : "dark";

  const setTheme = useCallback(
    (mode: StudioThemeMode) => {
      setNextTheme(mode);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, mode);
      }
    },
    [setNextTheme],
  );

  const toggleTheme = useCallback(() => {
    const next: StudioThemeMode = currentTheme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [currentTheme, setTheme]);

  const value = useMemo(
    () => ({ theme: currentTheme, setTheme, toggleTheme }),
    [currentTheme, setTheme, toggleTheme],
  );

  return (
    <StudioThemeContext.Provider value={value}>{children}</StudioThemeContext.Provider>
  );
}

const DEFAULT_STUDIO_THEME_CONTEXT: StudioThemeContextValue = {
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
};

export function useStudioTheme(): StudioThemeContextValue {
  const ctx = useContext(StudioThemeContext);
  return ctx ?? DEFAULT_STUDIO_THEME_CONTEXT;
}
