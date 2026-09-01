"use client";

import Link from "next/link";
import { BookOpen, FileText, MessagesSquare, User } from "lucide-react";
import { learnTabToHref } from "@/lib/learn-nav";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";
import { PageBreadcrumbs } from "@/components/global/page-breadcrumbs";

const NAV: { tab: LearnTab; label: string; href: string; icon: typeof BookOpen }[] = [
  { tab: "learn", label: "Modules", href: learnTabToHref("learn"), icon: BookOpen },
  { tab: "documents", label: "Documents", href: learnTabToHref("documents"), icon: FileText },
  { tab: "forum", label: "Forum", href: learnTabToHref("forum"), icon: MessagesSquare },
  { tab: "profile", label: "Account", href: learnTabToHref("profile"), icon: User },
];

/**
 * Learn marketing chrome — same width rhythm as the homepage (`SECTION_SHELL_INNER`).
 */
export function LearnAppShell({ children }: { children: React.ReactNode }) {
  const { activeTab } = useLearn();

  return (
    <div
      data-testid="learn-app-shell"
      className="learn-app flex min-h-svh w-full min-w-0 flex-1 flex-col bg-background"
    >
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className={cn(SECTION_SHELL_INNER, "flex h-16 items-center justify-between gap-6")}>
          <Link
            href="/"
            className="shrink-0 font-heading text-sm font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Budget Ndio Story
          </Link>
          <nav aria-label="Learn navigation" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.tab;
              return (
                <Link
                  key={item.tab}
                  href={item.href}
                  data-active={active || undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/reports"
            className={cn(
              T.btnOutline,
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold",
            )}
          >
            Reports
          </Link>
        </div>
      </header>

      <main className={cn(SECTION_SHELL_INNER, "w-full flex-1 pb-24 md:pb-16")}>
        <PageBreadcrumbs className="mb-6 pt-6 md:mb-8 md:pt-8" />
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
