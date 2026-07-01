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
  hasSession,
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

  // Use the bns_has_session cookie as the fast-path check.
  // The actual auth validation happens via GET /users/me/.
  const [hasActiveSession, setHasActiveSession] = useState(() => hasSession());

  // Refresh the session marker cookie on every successful profile fetch so
  // it never silently expires while the user is active.  Backend sets this
  // too (via Set-Cookie on /auth/login/ and /auth/token/refresh/), but the
  // frontend also sets it here to cover the gap between page navigations
  // where no API call happens.
  const refreshSessionMarker = useCallback(() => {
    document.cookie = "bns_has_session=true; path=/; max-age=86400; SameSite=Lax";
  }, []);

  const { data: user, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: USER_PROFILE_KEY,
    queryFn: async () => {
      const profile = await citizenApi.getMe();
      refreshSessionMarker();
      return normalizeProfile(profile);
    },
    enabled: hasActiveSession,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Clear session marker on 401 — transient errors (network, 5xx) must NOT
  // wipe the session state.
  useEffect(() => {
    if (isError && hasActiveSession) {
      const is401 = error instanceof ApiRequestError && error.status === 401;
      if (is401) {
        logDebug("Auth", "Session rejected by server (401); clearing marker");
        setHasActiveSession(false);
        document.cookie = "bns_has_session=; path=/; max-age=0";
        clearAuthTokens();
      } else {
        logDebug("Auth", "Profile query failed with non-401 error; keeping session", {
          error: error instanceof ApiRequestError ? error.status : "network",
        });
      }
    }
  }, [isError, hasActiveSession, error]);

  // Sync auth state across tabs via storage events + custom event
  useEffect(() => {
    const checkSession = () => {
      const stillHasSession = hasSession();
      setHasActiveSession(stillHasSession);
      if (!stillHasSession) {
        queryClient.clear();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      // Listen for any auth-related localStorage changes (legacy compat)
      if (e.key === "bns_has_session" || e.key === "access_token" || e.key === "refresh_token") {
        checkSession();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("bns-auth-changed", checkSession);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("bns-auth-changed", checkSession);
    };
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEY });
  }, [queryClient]);

  const login = useCallback(
    async (email: string, password: string, redirectTo = DEFAULT_POST_LOGIN_PATH) => {
      const safeRedirect = sanitizeRedirectPath(redirectTo);
      logDebug("Auth", "Login requested", { redirectTo: safeRedirect });

      // The login response sets HttpOnly cookies via Set-Cookie headers.
      // We do NOT extract tokens from the response body.
      await citizenApi.login(email, password);

      // Set the non-HttpOnly marker cookie so hasSession() returns true
      // immediately (the browser already has bns_at and bns_rt from the
      // Set-Cookie headers).
      refreshSessionMarker();

      // Fetch profile synchronously before enabling the useQuery to avoid a
      // double-fetch race.
      const profile = await citizenApi.getMe();
      queryClient.setQueryData(USER_PROFILE_KEY, normalizeProfile(profile));
      setHasActiveSession(true);
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
      logDebug("Auth", "Server logout failed; clearing local state anyway");
    }
    // Server response clears bns_at, bns_rt, bns_has_session cookies via
    // Set-Cookie headers. Also clear the marker client-side for immediate
    // state update.
    document.cookie = "bns_has_session=; path=/; max-age=0";
    clearAuthTokens();
    clearUserData();
    setHasActiveSession(false);
    queryClient.clear();
    logDebug("Auth", "Logout completed — navigating");
    router.push("/auth/login");
  }, [queryClient, router]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      loading: hasActiveSession && isLoading,
      isLoggedIn: hasActiveSession && (isSuccess || Boolean(user)),
      login,
      logout,
      refreshUser,
    }),
    [user, hasActiveSession, isLoading, isError, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
