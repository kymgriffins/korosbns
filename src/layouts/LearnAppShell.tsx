"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  MessagesSquare,
  User,
  PlaySquare,
  Layers,
  Radio,
  BarChart3,
} from "lucide-react";
import { learnTabToHref } from "@/lib/learn-nav";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import { cn } from "@/utils";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";

/** Navigation items conforming to LearnTab type for backward compatibility */
const NAV: { tab: LearnTab; label: string; href: string; icon: typeof BookOpen }[] = [
  { tab: "learn", label: "Learn", href: learnTabToHref("learn"), icon: BookOpen },
  { tab: "documents", label: "Docs", href: learnTabToHref("documents"), icon: FileText },
  { tab: "forum", label: "Forum", href: learnTabToHref("forum"), icon: MessagesSquare },
  { tab: "profile", label: "You", href: learnTabToHref("profile"), icon: User },
];

interface FormatNavLink {
  label: string;
  href: string;
  icon: typeof BookOpen;
  badge?: string;
  badgeColor?: string;
  isActive: (pathname: string) => boolean;
}

const FORMAT_LINKS: FormatNavLink[] = [
  {
    label: "Learn",
    href: "/learn",
    icon: BookOpen,
    isActive: (p) => p === "/learn",
  },
  {
    label: "Structured",
    href: "/learn/modules",
    icon: Layers,
    isActive: (p) => p.startsWith("/learn/modules") || p.startsWith("/learn/articles") || p.startsWith("/learn/videos"),
  },
  {
    label: "Reels",
    href: "/learn/stories",
    icon: PlaySquare,
    badge: "60s",
    badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    isActive: (p) => p.startsWith("/learn/stories") || p.startsWith("/stories"),
  },
  {
    label: "Podcasts",
    href: "/learn#podcasts",
    icon: Radio,
    isActive: () => false,
  },
  {
    label: "Docs",
    href: "/learn/documents",
    icon: FileText,
    isActive: (p) => p.startsWith("/learn/documents"),
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    isActive: (p) => p.startsWith("/reports"),
  },
];

/**
 * Mobile-first learn shell — standalone header (reveals on scroll), responsive dock.
 */
export function LearnAppShell({ children }: { children: React.ReactNode }) {
  const { activeTab } = useLearn();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLanding = pathname === "/learn";
  const isStories = pathname.startsWith("/learn/stories");
  const showNav = !isLanding || scrolled;

  if (isStories) {
    return (
      <div data-testid="learn-app-shell" className="learn-app fixed inset-0 z-50 h-dvh w-screen overflow-hidden bg-black text-white">
        {children}
      </div>
    );
  }

  return (
    <div
      data-testid="learn-app-shell"
      className="learn-app flex min-h-svh w-full min-w-0 flex-1 flex-col bg-background"
    >
      {/* Standalone Learn Navbar — appears on scroll on landing, fixed on subpages */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-md transition-all duration-300",
          showNav
            ? "translate-y-0 opacity-100 shadow-xs pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="learn-app-shell-inner flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-muted-foreground transition-colors hover:text-foreground"
              title="Return to Main Site"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Main Site</span>
            </Link>
            <div className="h-4 w-px bg-border/60" />
            <Link
              href="/learn"
              className="flex items-center gap-2 text-xs font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="font-heading font-black text-sm sm:text-base">BNS Learn</span>
              <span className="hidden md:inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                Civic Hub
              </span>
            </Link>
          </div>

          {/* Desktop & Tablet Format Switcher */}
          <nav aria-label="Learn media formats" className="hidden sm:flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
            {FORMAT_LINKS.map((item) => {
              const active = item.isActive(pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.2 text-[9px] font-bold tracking-wider uppercase border",
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                          : item.badgeColor,
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Forum shortcut */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/learn/forum"
              className={cn(
                "hidden md:inline-flex rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors",
                pathname.startsWith("/learn/forum") ? "bg-muted text-foreground border-border" : ""
              )}
            >
              Forum
            </Link>
            <Link
              href="/learn/profile"
              className={cn(
                "rounded-full border border-border/60 px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-colors",
                pathname.startsWith("/learn/profile") ? "bg-primary text-primary-foreground border-primary" : ""
              )}
            >
              My Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area — no artificial offset on landing, pt-16 on subpages */}
      <main
        className={cn(
          "learn-app-shell-inner w-full flex-1 px-4 sm:px-6 pb-20 md:pb-16",
          isLanding ? "pt-0" : "pt-16"
        )}
      >
        {children}
      </main>

      {/* Mobile Navigation Dock */}
      <div className="md:hidden">
        <LearnMobileNav />
      </div>
    </div>
  );
}

/** @deprecated Use LearnAppShell — kept for any leftover imports during migration. */
export const CitizenSyllabusShell = LearnAppShell;
