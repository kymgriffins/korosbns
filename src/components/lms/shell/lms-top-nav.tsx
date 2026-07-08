/**
 * @sdp-provenance
 * intent: INTENT-001
 * capability: CAP-learning-shell
 * requirements: REQ-0001
 * contracts: CTR-lms-shell@1.0.0
 * builder: SDP-Builder
 * date: 2026-07-07
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Target, Trophy, User } from "lucide-react";
import { LmsRoutes } from "@/data/lms/routes";
import { isLmsNavActive } from "@/lib/learn-nav";
import { cn } from "@/utils";

const DESKTOP_LINKS = [
  { label: "Catalogue", href: LmsRoutes.catalogue },
  { label: "My Learning", href: LmsRoutes.progress },
  { label: "Achievements", href: LmsRoutes.achievements },
] as const;

export function LmsTopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 hidden border-b border-border/60 bg-background/90 backdrop-blur-md lg:block">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        <Link href={LmsRoutes.home} className="shrink-0">
          <Image
            src="/logo.svg"
            alt="Budget Ndio Story"
            width={120}
            height={32}
            className="h-7 w-auto"
          />
        </Link>

        <nav className="flex flex-1 items-center gap-1" aria-label="Learn navigation">
          {DESKTOP_LINKS.map((item) => {
            const active = isLmsNavActive(pathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "ljp-nav-active bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={LmsRoutes.search}
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            aria-label="Search"
          >
            <Search className="size-4" />
          </Link>
          <Link
            href={LmsRoutes.profile}
            aria-current={isLmsNavActive(pathname, LmsRoutes.profile) ? "page" : undefined}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full border transition-colors",
              isLmsNavActive(pathname, LmsRoutes.profile)
                ? "ljp-nav-active border-foreground/30 bg-foreground/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
            aria-label="Profile"
          >
            <User className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
