"use client";

import Link from "next/link";
import { BookOpen, FileText, Home, MessagesSquare, User } from "lucide-react";
import { learnTabToHref } from "@/lib/learn-nav";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import { cn } from "@/utils";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";

const NAV: { tab: LearnTab; label: string; href: string; icon: typeof Home }[] = [
  { tab: "home", label: "Syllabus", href: learnTabToHref("home"), icon: Home },
  { tab: "learn", label: "Modules", href: learnTabToHref("learn"), icon: BookOpen },
  { tab: "documents", label: "Documents", href: learnTabToHref("documents"), icon: FileText },
  { tab: "forum", label: "Forum", href: learnTabToHref("forum"), icon: MessagesSquare },
  { tab: "profile", label: "Account", href: learnTabToHref("profile"), icon: User },
];

/**
 * Citizen syllabus chrome — top nav + content. Replaces admin AppSidebar shell.
 */
export function CitizenSyllabusShell({ children }: { children: React.ReactNode }) {
  const { activeTab } = useLearn();

  return (
    <div data-testid="citizen-syllabus-shell" className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/learn" className="text-sm font-bold tracking-tight text-foreground">
            Budget Ndio Story
          </Link>
          <nav aria-label="Learn syllabus" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.tab;
              return (
                <Link
                  key={item.tab}
                  href={item.href}
                  data-active={active || undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                    active
                      ? "bg-muted text-foreground"
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
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Reports
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 pb-20 md:pb-8">{children}</main>

      <div className="md:hidden">
        <LearnMobileNav />
      </div>
    </div>
  );
}
