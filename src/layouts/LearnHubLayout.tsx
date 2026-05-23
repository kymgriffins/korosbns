"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Bell, Search, User } from "lucide-react";
import { LEARN_TABS } from "@/constants/learn-tabs";
import { Routes } from "@/constants/routes";
import { fetchGamificationMe, type GamificationState } from "@/lib/gamification";
import { trackAnalytics } from "@/lib/gamification";
import { cn } from "@/utils";

export function LearnHubTopBar({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}) {
  const [gamification, setGamification] = useState<GamificationState | null>(null);

  useEffect(() => {
    void fetchGamificationMe().then(setGamification);
  }, []);

  const points = gamification?.points ?? 0;
  const level = gamification?.level ?? 1;
  const streak = gamification?.streak_days ?? 0;
  const ringPercent = Math.min(100, points % 100);

  return (
    <header className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search the Learn Hub…"
            className="h-10 w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Search learning content"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <div
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold"
            aria-label={`${points} experience points, level ${level}`}
          >
            <span
              className="relative flex size-9 items-center justify-center rounded-full border-2 border-primary bg-primary/10"
            >
              <span className="text-[10px] font-bold text-primary">{ringPercent}</span>
            </span>
            <span className="hidden sm:inline">
              {points} XP · Lv {level} · {streak}d streak
            </span>
          </div>
          <Link
            href={Routes.AccountNotifications}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
          </Link>
          <Link
            href={Routes.LearnProfile}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Learner profile"
          >
            <User className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function LearnHubTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-[calc(4rem+3.25rem)] z-20 border-b border-border bg-background/90 backdrop-blur-sm"
      aria-label="Learn hub sections"
    >
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
        {LEARN_TABS.map((tab) => {
          const active =
            tab.href === "/learn"
              ? pathname === "/learn" || pathname.startsWith("/learn/paths") || pathname.startsWith("/learn/units")
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              onClick={() => void trackAnalytics("learn_tab_view", { tab: tab.key })}
              className={cn(
                "shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function LearnHubLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const onSearchChange = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <LearnHubTopBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <LearnHubTabs />
      {children}
    </div>
  );
}

export default function LearnHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background pt-16" />}>
      <LearnHubLayoutInner>{children}</LearnHubLayoutInner>
    </Suspense>
  );
}
