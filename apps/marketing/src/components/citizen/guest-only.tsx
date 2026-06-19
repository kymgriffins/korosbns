"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { DEFAULT_POST_LOGIN_PATH, sanitizeRedirectPath } from "@/lib/auth-policy";
import { useAuth } from "@/contexts/auth-context";

/** Redirects authenticated users away from login/register. */
export function GuestOnly({
  children,
  redirectTo = DEFAULT_POST_LOGIN_PATH,
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const safeRedirect = sanitizeRedirectPath(redirectTo);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.replace(safeRedirect);
    }
  }, [loading, isLoggedIn, router, safeRedirect]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" aria-busy="true">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isLoggedIn) return null;
  return <>{children}</>;
}
