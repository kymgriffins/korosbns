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
import { ApiRequestError } from "@/lib/api-errors";
import {
  citizenApi,
  clearAuthTokens,
  getAccessToken,
  normalizeLoginResponse,
  setAuthTokens,
  type UserProfileApi,
} from "@/lib/api-client";
import { DEFAULT_POST_LOGIN_PATH, sanitizeRedirectPath } from "@/lib/auth-policy";
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

  const { data: user, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: USER_PROFILE_KEY,
    queryFn: async () => {
      const profile = await citizenApi.getMe();
      return normalizeProfile(profile);
    },
    enabled: hasToken,
    staleTime: 1000 * 60 * 5,
  });

  // Clear tokens only on 401 — transient errors (network, 5xx) must NOT wipe the session
  useEffect(() => {
    if (isError && hasToken) {
      const is401 = error instanceof ApiRequestError && error.status === 401;
      if (is401) {
        logDebug("Auth", "Token rejected by server (401); clearing");
        clearAuthTokens();
        setHasToken(false);
      } else {
        logDebug("Auth", "Profile query failed with non-401 error; keeping tokens", {
          error: error instanceof ApiRequestError ? error.status : "network",
        });
      }
    }
  }, [isError, hasToken, error]);

  // Sync auth state across tabs when localStorage changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "refresh_token" || e.key === "bns_token_storage_mode") {
        const stillHasToken = Boolean(getAccessToken());
        setHasToken(stillHasToken);
        if (!stillHasToken) {
          queryClient.clear();
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEY });
  }, [queryClient]);

  const login = useCallback(
    async (email: string, password: string, redirectTo = DEFAULT_POST_LOGIN_PATH) => {
      const safeRedirect = sanitizeRedirectPath(redirectTo);
      logDebug("Auth", "Login requested", { redirectTo: safeRedirect });
      clearUserData({ keepOnboarding: true });
      const raw = await citizenApi.login(email, password);
      const tokens = normalizeLoginResponse(raw as Record<string, unknown>);
      if (!tokens?.access) {
        logDebug("Auth", "Login response missing access token", { rawKeys: Object.keys(raw as object) });
        throw new Error("Login response missing access token.");
      }
      setAuthTokens(tokens.access, tokens.refresh);
      logDebug("Auth", "Login token stored");
      // Fetch profile synchronously before enabling the useQuery to avoid a
      // double-fetch race (useQuery fires on enabled=true, and a separate
      // refetchQueries would create a second parallel fetch).
      const profile = await citizenApi.getMe();
      queryClient.setQueryData(USER_PROFILE_KEY, normalizeProfile(profile));
      setHasToken(true);
      logDebug("Auth", "Login completed", { redirectTo: safeRedirect });
      router.push(safeRedirect);
    },
    [router, queryClient],
  );

  function clearUserData(options?: { keepOnboarding?: boolean }): void {
    if (typeof window === "undefined") return;
    const userKeys = options?.keepOnboarding
      ? ["bns_user_profile", "bns_story_watched"]
      : ["bns_user_profile", "bns_onboarding_profile", "bns_story_watched"];
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
    window.dispatchEvent(new Event("bns-profile-updated"));
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
    logDebug("Auth", "Logout completed — navigating");
    router.push("/auth/login");
  }, [queryClient, router]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      loading: hasToken && isLoading,
      isLoggedIn: hasToken && (isSuccess || Boolean(user)),
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
