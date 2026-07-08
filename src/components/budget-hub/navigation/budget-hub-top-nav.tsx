"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { Routes } from "@/constants/routes";
import { learnTabToHref } from "@/lib/learn-nav";
import { cn } from "@/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";

const NAV_LINKS = [
  { label: "Home", href: Routes.Learn },
  { label: "Journeys", href: learnTabToHref("learn") },
  { label: "Articles", href: Routes.LearnArticles },
  { label: "Stories", href: Routes.LearnStories },
] as const;

export function BudgetHubTopNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const shadow = useTransform(scrollY, [0, 12], [0, 1]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 8));
    return () => unsub();
  }, [scrollY]);

  const displayName =
    user?.display_name ||
    user?.break_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() ||
    "";
  const initials = displayName
    ? displayName
        .split(" ")
        .map((p) => p[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  function isActive(href: string) {
    const [path, query] = href.split("?");
    if (pathname !== path) return false;
    if (query) {
      const expected = new URLSearchParams(query).get("tab");
      return tab === expected;
    }
    return pathname === Routes.Learn && !tab;
  }

  return (
    <motion.header
      style={{ boxShadow: shadow.get() ? undefined : undefined }}
      className={cn(
        "sticky top-0 z-40 border-b border-transparent bg-[var(--bh-canvas)]/80 backdrop-blur-md transition-shadow duration-150",
        scrolled && "border-[var(--bh-border)] shadow-sm",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[var(--bh-content-max)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={Routes.Learn}
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
        >
          <Image src="/logo.svg" alt="" width={28} height={28} className="size-7" />
          <span className="hidden sm:inline">Budget Hub</span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Budget Hub"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
                isActive(link.href)
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden max-w-xs lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              readOnly
              aria-label="Search Budget Hub"
              placeholder="Search…"
              className="h-9 rounded-full border-[var(--bh-border)] bg-[var(--bh-surface)] pl-9 text-sm"
              onFocus={() => {
                window.location.href = `${Routes.LearnArticles}?focus=search`;
              }}
            />
          </div>

          <Link
            href={learnTabToHref("profile")}
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar className="size-8">
              {user?.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={displayName || "Profile"}
                  width={32}
                  height={32}
                  className="size-full rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              )}
            </Avatar>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
