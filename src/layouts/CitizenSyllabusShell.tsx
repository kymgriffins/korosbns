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
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/learn" className="text-sm font-semibold tracking-tight text-foreground">
            Budget Ndio Story
          </Link>
          <nav aria-label="Learn syllabus" className="hidden items-center gap-0.5 md:flex">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.tab;
              return (
                <Link
                  key={item.tab}
                  href={item.href}
                  data-active={active || undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
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
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Reports
          </Link>
        </div>
      </header>

      <main className="w-full flex-1 pb-20 md:pb-10">{children}</main>

      <div className="md:hidden">
        <LearnMobileNav />
      </div>
    </div>
  );
}
