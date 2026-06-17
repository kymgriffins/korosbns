"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import {
  ArrowLeft, ExternalLink,
} from "lucide-react";
import { LearnProvider } from "@/contexts/learn-context";
import { LearnTabSync } from "@/components/learn/learn-tab-sync";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";
import { LearnTopNav } from "@/layouts/LearnTopNav";
import {
  SidebarProvider,
} from "@/ui/sidebar";

function LearnAppShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkProfile = () => {
      try {
        const raw = localStorage.getItem("bns_user_profile");
        setHasProfile(!!raw && JSON.parse(raw)?.breakName);
      } catch {
        setHasProfile(false);
      }
    };
    checkProfile();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "bns_user_profile") checkProfile();
    };
    const onProfileUpdate = () => checkProfile();
    window.addEventListener("storage", onStorage);
    window.addEventListener("bns-profile-updated", onProfileUpdate);

    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("bns-profile-updated", onProfileUpdate);
    };
  }, []);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const onScroll = () => setScrolled(main.scrollTop > 10);
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  if (!isLoggedIn && !hasProfile) {
    return (
      <div className="min-h-dvh bg-background text-foreground overflow-hidden flex items-center justify-center">
        <main className="w-full">{children}</main>
      </div>
    );
  }

  return (
    <div className="h-dvh min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      <LearnTopNav />

      {/* Mobile header */}
      <header
        className={`flex h-12 items-center justify-between gap-2 border-b px-3 md:hidden sticky top-0 z-20 transition-all duration-200 ${
          scrolled
            ? "bg-background/80 backdrop-blur-lg shadow-xs border-border/50"
            : "bg-background border-border/30"
        }`}
      >
        <Link href="/learn" className="flex items-center gap-2 min-w-0">
          <img src="/logo.svg" alt="BNS" className="h-6 w-auto shrink-0" />
        </Link>
        <div className="flex items-center gap-1">
          <a
            href="/learn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Learning Hub in a new tab"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ExternalLink className="size-4" />
          </a>
          <ThemeToggle />
          <Link
            href="/"
            aria-label="Back to main site"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 text-xs font-bold text-primary ring-1 ring-primary/20 transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-3.5" />
            Main site
          </Link>
        </div>
      </header>

      <SidebarProvider>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </SidebarProvider>

      <div className="md:hidden"><LearnMobileNav /></div>
    </div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace(`/auth/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isLoggedIn) return null;
  return <>{children}</>;
}

export default function LearnHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <LearnProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }>
        <AuthGuard>
          <LearnTabSync />
          <LearnAppShell>{children}</LearnAppShell>
        </AuthGuard>
      </Suspense>
    </LearnProvider>
  );
}
