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
  user: null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading] = useState(false);

  const login = useCallback(async (_email: string, _password: string) => {
    throw new Error("Auth not implemented");
  }, []);

  const logout = useCallback(async () => {
    // TODO: implement logout
  }, []);

  const value = useMemo(
    () => ({ user: null, loading, isLoggedIn: false, login, logout }),
    [loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
