"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { citizenApi, type UserProfileApi } from "@/lib/api-client";
import { DEFAULT_POST_LOGIN_PATH, sanitizeRedirectPath } from "@/lib/auth-policy";
import { logDebug } from "@/lib/debug-logs";
import { clearCitizenLocalSession, readOnboardingDraft } from "@/lib/profile-local-storage";

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

  const AUTH_TIMEOUT_MS = 5000;

  // Always try to fetch the user profile on mount. If the browser has
  // HttpOnly cookies (bns_at/bns_rt), the request succeeds and isLoggedIn
  // becomes true. If there are no cookies, Django returns 401 and the
  // user is treated as anonymous — no session marker needed.
  // A timeout prevents the login page from hanging indefinitely when
  // the backend is unreachable (GuestOnly waits for loading=false).
  const { data: user, isLoading } = useQuery({
    queryKey: USER_PROFILE_KEY,
    queryFn: async () => {
      const profile = await Promise.race([
        citizenApi.getMe(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Auth check timed out")), AUTH_TIMEOUT_MS)
        ),
      ]);
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

      // Push register draft + queued gamification/progress regardless of network timing.
      try {
        const { flushAllOfflineCitizenData } = await import("@/lib/sync-profile");
        const draft = readOnboardingDraft();
        await flushAllOfflineCitizenData(undefined, {
          breakName:
            draft?.breakName || profile.break_name || profile.display_name || "",
          pseudoName: draft?.pseudoName || profile.pseudo_name || "",
          county: draft?.county || profile.county || "",
          ward: draft?.ward || profile.ward,
          language: draft?.language || profile.language_preference || "EN",
          // Prefer local draft over empty server fields (first login after register).
          ageRange: draft?.ageRange || profile.age_range,
          educationLevel: draft?.educationLevel || profile.education_level,
          priorities: draft?.priorities?.length
            ? draft.priorities
            : profile.budget_priorities,
        });
        await queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEY });
      } catch (err) {
        logDebug("Auth", "Offline flush deferred", { err: String(err) });
      }

      router.push(safeRedirect);
    },
    [router, queryClient],
  );

  function clearUserData(): void {
    clearCitizenLocalSession({ wipePendingPersonalization: false });
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onOnline = () => {
      if (!user) return;
      void import("@/lib/sync-profile").then(({ flushAllOfflineCitizenData }) => {
        void flushAllOfflineCitizenData().then(() => {
          void queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEY });
        });
      });
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [user, queryClient]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      loading: isLoading,
      isLoggedIn: !isLoading && !!user,
      login,
      logout,
      refreshUser: () => queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEY }),
    }),
    [user, isLoading, login, logout, queryClient],
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
