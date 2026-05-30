"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";

/** Redirects authenticated users away from login/register. */
export function GuestOnly({
  children,
  redirectTo = Routes.Learn,
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.replace(redirectTo);
    }
  }, [loading, isLoggedIn, router, redirectTo]);

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
