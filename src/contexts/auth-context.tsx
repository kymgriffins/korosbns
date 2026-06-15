"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  setAuthTokens,
  type UserProfileApi,
} from "@/lib/api-client";
import { logDebug } from "@/lib/debug-logs";

const USER_PROFILE_KEY = ["auth", "me"];

type AuthContextValue = {
  user: UserProfileApi | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeProfile(profile: UserProfileApi): UserProfileApi {
  return {
    ...profile,
    avatar_url: profile.avatar_url ?? profile.avatar ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(() => Boolean(getAccessToken()));

  const { data: user, isLoading, isError } = useQuery({
    queryKey: USER_PROFILE_KEY,
    queryFn: async () => {
      const profile = await citizenApi.getMe();
      return normalizeProfile(profile);
    },
    enabled: hasToken,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Clear stale tokens when the API rejects them
  useEffect(() => {
    if (isError && hasToken) {
      logDebug("Auth", "Token rejected by server; clearing");
      clearAuthTokens();
      setHasToken(false);
    }
  }, [isError, hasToken]);

  const refreshUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEY });
  }, [queryClient]);

  const login = useCallback(
    async (email: string, password: string, redirectTo = "/learn") => {
      logDebug("Auth", "Login requested", { email, redirectTo });
      clearUserData();
      const tokens = await citizenApi.login(email, password);
      setAuthTokens(tokens.access, tokens.refresh);
      setHasToken(true);
      logDebug("Auth", "Login token stored");
      await queryClient.refetchQueries({ queryKey: USER_PROFILE_KEY });
      logDebug("Auth", "Login completed", { email, redirectTo });
      router.push(redirectTo);
    },
    [router, queryClient],
  );

  function clearUserData(): void {
  if (typeof window === "undefined") return;
  const userKeys = [
    "bns_user_profile",
    "bns_onboarding_profile",
    "bns_story_watched",
  ];
  for (const key of userKeys) {
    window.localStorage.removeItem(key);
  }
  for (let i = window.localStorage.length - 1; i >= 0; i--) {
    const key = window.localStorage.key(i);
    if (!key) continue;
    if (key.startsWith("bns_module_") || key.startsWith("stage_")) {
      window.localStorage.removeItem(key);
    }
  }
  window.sessionStorage.removeItem("bns_streak_toast");
}

const logout = useCallback(async () => {
  logDebug("Auth", "Logout requested");
  try {
    await citizenApi.logout();
  } catch {
    logDebug("Auth", "Server logout failed; clearing local tokens anyway");
  }
  clearAuthTokens();
  clearUserData();
  setHasToken(false);
  queryClient.clear();
  logDebug("Auth", "Logout completed");
  router.push("/auth/login");
}, [router, queryClient]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      loading: hasToken && isLoading,
      isLoggedIn: Boolean(user) && !isError,
      login,
      logout,
      refreshUser,
    }),
    [user, hasToken, isLoading, isError, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
