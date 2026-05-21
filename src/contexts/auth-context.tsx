"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  citizenApi,
  clearAuthTokens,
  getAccessToken,
  getTokenStorageMode,
  setAuthTokens,
  type UserProfileApi,
} from "@/lib/api-client";
import { logDebug, sanitizeToken } from "@/lib/debug-logs";

type AuthContextValue = {
  user: UserProfileApi | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfileApi | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      logDebug("Auth", "Skipping refreshUser without access token");
      setUser(null);
      return;
    }
    try {
      logDebug("Auth", "Refreshing authenticated user profile");
      const profile = await citizenApi.getMe();
      setUser(profile);
      logDebug("Auth", "User profile refreshed", { email: profile.email });
    } catch {
      logDebug("Auth", "Refresh user failed; clearing tokens");
      clearAuthTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      if (!getAccessToken()) {
        if (alive) {
          logDebug("Auth", "No token at startup; user unauthenticated");
          setUser(null);
          setLoading(false);
        }
        return;
      }
      try {
        logDebug("Auth", "Hydrating auth state from token", {
          token: sanitizeToken(getAccessToken()),
          storage: getTokenStorageMode(),
        });
        const profile = await citizenApi.getMe();
        if (alive) setUser(profile);
        logDebug("Auth", "Auth hydration complete", { email: profile.email });
      } catch {
        logDebug("Auth", "Auth hydration failed; token cleared");
        clearAuthTokens();
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string, redirectTo = "/account") => {
      logDebug("Auth", "Login requested", { email, redirectTo });
      const tokens = await citizenApi.login(email, password);
      setAuthTokens(tokens.access, tokens.refresh);
      logDebug("Auth", "Login token stored", {
        access: sanitizeToken(tokens.access),
        refresh: sanitizeToken(tokens.refresh),
        storage: getTokenStorageMode(),
      });
      const profile = await citizenApi.getMe();
      setUser(profile);
      logDebug("Auth", "Login completed", { email: profile.email, redirectTo });
      router.push(redirectTo);
    },
    [router],
  );

  const logout = useCallback(async () => {
    logDebug("Auth", "Logout requested");
    try {
      await citizenApi.logout();
    } catch {
      /* still clear locally */
      logDebug("Auth", "Server logout failed; clearing local tokens anyway");
    }
    clearAuthTokens();
    setUser(null);
    logDebug("Auth", "Logout completed");
    router.push("/auth/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoggedIn: Boolean(user),
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
