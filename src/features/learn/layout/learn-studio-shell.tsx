"use client";

import Link from "next/link";
import { Suspense } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { LearnProvider, useLearn } from "@/contexts/learn-context";
import { LearnTabSync } from "../components/learn-tab-sync";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { Routes } from "@/constants/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LearnStudioNav } from "./learn-studio-nav";
import { cn } from "@/lib/utils";

function ShellInner({ children }: { children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useLearn();
  const { isLoggedIn, user } = useAuth();
  const name = user?.display_name || user?.first_name || "Guest";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="learn-studio relative flex min-h-dvh flex-col bg-background md:flex-row">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_45%_at_50%_-15%,hsl(var(--primary)/0.1),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.4] dark:opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)/0.35) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)/0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 50% at 50% 0%, black, transparent)",
        }}
        aria-hidden
      />

      <aside className="hidden w-56 shrink-0 border-r border-border/40 bg-card/30 backdrop-blur-sm md:flex md:flex-col">
        <div className="flex h-14 items-center gap-2.5 border-b border-border/40 px-5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="size-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">Learn Studio</p>
            <p className="text-micro text-muted-foreground">Budget literacy</p>
          </div>
        </div>
        <LearnStudioNav activeTab={activeTab} onSelect={setActiveTab} className="flex-1 border-0 bg-transparent" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/40 bg-background/70 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
          <div className="flex items-center gap-2 md:hidden">
            <Sparkles className="size-4 text-primary" />
            <p className="text-sm font-semibold tracking-tight">Learn Studio</p>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isLoggedIn ? (
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href={Routes.Account} aria-label="Account">
                  <Avatar className="size-8">
                    <AvatarImage src={user?.avatar_url || undefined} alt="" />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" asChild>
                <Link href={Routes.Login}>Sign in</Link>
              </Button>
            )}
          </div>
        </header>

        <main className={cn("flex-1 overflow-y-auto", "pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-8")}>
          {children}
        </main>

        <div className="md:hidden">
          <LearnStudioNav activeTab={activeTab} onSelect={setActiveTab} />
        </div>
      </div>
    </div>
  );
}

export function LearnStudioShell({ children }: { children: React.ReactNode }) {
  return (
    <LearnProvider>
      <Suspense fallback={null}>
        <LearnTabSync />
      </Suspense>
      <ShellInner>{children}</ShellInner>
    </LearnProvider>
  );
}
