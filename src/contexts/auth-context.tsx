"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { citizenApi, type UserProfileApi } from "@/lib/api-client";
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

  // Always try to fetch the user profile on mount. If the browser has
  // HttpOnly cookies (bns_at/bns_rt), the request succeeds and isLoggedIn
  // becomes true. If there are no cookies, Django returns 401 and the
  // user is treated as anonymous — no session marker needed.
  const { data: user, isLoading, isSuccess } = useQuery({
    queryKey: USER_PROFILE_KEY,
    queryFn: async () => {
      const profile = await citizenApi.getMe();
      return normalizeProfile(profile);
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const login = useCallback(
    async (email: string, password: string, redirectTo = DEFAULT_POST_LOGIN_PATH) => {
      const safeRedirect = sanitizeRedirectPath(redirectTo);
      logDebug("Auth", "Login requested", { redirectTo: safeRedirect });

      // The login response sets HttpOnly cookies via Set-Cookie headers.
      // We do NOT extract tokens from the response body.
      await citizenApi.login(email, password);

      // Fetch profile synchronously to avoid a double-fetch race.
      const profile = await citizenApi.getMe();
      queryClient.setQueryData(USER_PROFILE_KEY, normalizeProfile(profile));
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
    clearAuthTokens();
    clearUserData();
    queryClient.clear();
    logDebug("Auth", "Logout completed — navigating");
    router.push("/auth/login");
  }, [queryClient, router]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      loading: isLoading,
      isLoggedIn: isSuccess && !!user,
      login,
      logout,
      refreshUser: () => queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEY }),
    }),
    [user, isLoading, isSuccess, login, logout, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Remove tokens from localStorage (legacy compat — no-op for HttpOnly cookies).
function clearAuthTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}
