"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type StudioThemeMode = "dark" | "light";

const STORAGE_KEY = "bns-studio-theme";

type StudioThemeContextValue = {
  theme: StudioThemeMode;
  setTheme: (mode: StudioThemeMode) => void;
  toggleTheme: () => void;
};

const StudioThemeContext = createContext<StudioThemeContextValue | null>(null);

function readStoredTheme(): StudioThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

export function StudioThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<StudioThemeMode>("dark");

  useEffect(() => {
    setThemeState(readStoredTheme());
  }, []);

  const setTheme = useCallback((mode: StudioThemeMode) => {
    setThemeState(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: StudioThemeMode = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <StudioThemeContext.Provider value={value}>{children}</StudioThemeContext.Provider>
  );
}

export function useStudioTheme() {
  const ctx = useContext(StudioThemeContext);
  if (!ctx) {
    throw new Error("useStudioTheme must be used within StudioThemeProvider");
  }
  return ctx;
}
