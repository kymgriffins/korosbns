"use client";

import Image from "next/image";
import Link from "next/link";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/ui/button";

/** Minimal header for auth/account flows (no full marketing navbar). */
export function Nav() {
  const { isLoggedIn, loading } = useAuth();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href={Routes.Home} className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Budget Ndio Story" width={120} height={24} className="h-5 w-auto" />
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href={Routes.Learn} className="hidden sm:inline text-muted-foreground hover:text-foreground">
            Learn
          </Link>
          <Link href={Routes.Surveys} className="hidden sm:inline text-muted-foreground hover:text-foreground">
            Surveys
          </Link>
          {!loading && (
            <Button asChild variant="outline" size="sm">
              <Link href={isLoggedIn ? Routes.Account : Routes.Login}>
                {isLoggedIn ? "Account" : "Sign in"}
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
