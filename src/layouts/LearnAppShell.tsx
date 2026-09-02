"use client";

import Link from "next/link";
import { BookOpen, FileText, MessagesSquare, User } from "lucide-react";
import { learnTabToHref } from "@/lib/learn-nav";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import { cn } from "@/utils";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";

const NAV: { tab: LearnTab; label: string; href: string; icon: typeof BookOpen }[] = [
  { tab: "learn", label: "Learn", href: learnTabToHref("learn"), icon: BookOpen },
  { tab: "documents", label: "Docs", href: learnTabToHref("documents"), icon: FileText },
  { tab: "forum", label: "Forum", href: learnTabToHref("forum"), icon: MessagesSquare },
  { tab: "profile", label: "You", href: learnTabToHref("profile"), icon: User },
];

/**
 * Mobile-first learn shell — narrow column, app-style chrome, no layout breadcrumbs.
 */
export function LearnAppShell({ children }: { children: React.ReactNode }) {
  const { activeTab } = useLearn();

  return (
    <div
      data-testid="learn-app-shell"
      className="learn-app flex min-h-svh w-full min-w-0 flex-1 flex-col bg-background"
    >
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="learn-app-shell-inner flex h-14 items-center justify-between gap-3 px-4">
          <Link
            href="/"
            className="shrink-0 text-sm font-semibold tracking-tight text-foreground"
          >
            BNS Learn
          </Link>
          <nav aria-label="Learn navigation" className="hidden items-center gap-0.5 sm:flex">
            {NAV.map((item) => {
              const active = activeTab === item.tab;
              return (
                <Link
                  key={item.tab}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/reports"
            className="shrink-0 rounded-full border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Reports
          </Link>
        </div>
      </header>

      <main className="learn-app-shell-inner w-full flex-1 px-4 pb-24 pt-4 md:pb-16">
        {children}
      </main>

      <div className="md:hidden">
        <LearnMobileNav />
      </div>
    </div>
  );
}

/** @deprecated Use LearnAppShell — kept for any leftover imports during migration. */
export const CitizenSyllabusShell = LearnAppShell;
