"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { buildLoginUrl } from "@/lib/auth-policy";
import { useAuth } from "@/contexts/auth-context";

/**
 * Client-side guard for routes listed in LEARN_PROTECTED_PATH_PREFIXES.
 * Middleware performs the first redirect; this validates the session via /users/me/.
 */
export function Protected({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace(buildLoginUrl(window.location.pathname));
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) return null;
  return <>{children}</>;
}
