"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { Routes } from "@/constants";
import { useStudioTheme } from "@/contexts/studio-theme-context";
import { cn } from "@/utils";

type Props = {
  children: React.ReactNode;
};

export function StudioAppShell({ children }: Props) {
  const { theme, toggleTheme } = useStudioTheme();
  const pathname = usePathname();
  const isReelHome = pathname === "/bns-studio";

  return (
    <div
      data-studio-theme={theme}
      className="studio-app studio-theatre min-h-dvh w-full"
    >
      {!isReelHome ? (
      <header className="sticky top-0 z-50 border-b border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-bg)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[90rem] items-center justify-between gap-4 px-4 md:h-16 md:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/bns-studio"
              className="truncate text-sm font-bold uppercase tracking-[0.2em] text-[var(--studio-theatre-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--studio-theatre-accent)]"
            >
              BNS Studios
            </Link>
            <span className="hidden text-xs text-[var(--studio-theatre-muted)] sm:inline">
              Impact production
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full border border-[var(--studio-theatre-border)]",
                "text-[var(--studio-theatre-fg)] transition-colors hover:bg-[var(--studio-theatre-surface)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--studio-theatre-accent)]",
              )}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? (
                <Sun className="size-4" aria-hidden />
              ) : (
                <Moon className="size-4" aria-hidden />
              )}
            </button>
            <Link
              href={Routes.Home}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--studio-theatre-border)] px-3 text-xs font-semibold",
                "text-[var(--studio-theatre-muted)] transition-colors hover:text-[var(--studio-theatre-fg)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--studio-theatre-accent)]",
              )}
            >
              BNS main site
              <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </header>
      ) : (
        <div className="studio-reel-floating-controls">
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full border border-white/20",
              "bg-black/40 text-white backdrop-blur-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
            )}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Link
            href={Routes.Home}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1 rounded-full border border-white/20 bg-black/40 px-3 text-xs font-semibold text-white backdrop-blur-md"
          >
            BNS
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      )}

      <main className="w-full flex-1">{children}</main>
    </div>
  );
}
