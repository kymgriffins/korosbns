"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

type AuthContextValue = {
  user: Record<string, unknown> | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<Record<string, unknown> | null>({
    display_name: "Guest",
    email: "guest@example.com",
  });
  const [loading] = useState(false);

  const login = useCallback(async (_email: string, _password: string) => {
    // Auth not wired yet — UI bypass for development
  }, []);

  const logout = useCallback(async () => {
    // TODO: implement logout
  }, []);

  const value = useMemo(
    () => ({ user, loading, isLoggedIn: true, login, logout }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
