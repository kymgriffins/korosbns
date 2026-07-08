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
import { Search, User } from "lucide-react";
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
    <header className="sticky top-0 z-50 hidden border-b border-border/60 bg-background/95 backdrop-blur-md dark:bg-[var(--ljp-nav)] lg:block">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-10 px-12">
        <Link href={LmsRoutes.home} className="shrink-0">
          <Image
            src="/logo.svg"
            alt="Budget Ndio Story"
            width={140}
            height={38}
            className="h-8 w-auto"
          />
        </Link>

        <nav className="flex flex-1 items-center gap-4" aria-label="Learn navigation">
          {DESKTOP_LINKS.map((item) => {
            const active = isLmsNavActive(pathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium tracking-[0.01em] transition-colors",
                  active
                    ? "ljp-nav-active border border-border/50 text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={LmsRoutes.search}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
            aria-label="Search"
          >
            <Search className="size-4" />
          </Link>
          <Link
            href={LmsRoutes.profile}
            aria-current={isLmsNavActive(pathname, LmsRoutes.profile) ? "page" : undefined}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
              isLmsNavActive(pathname, LmsRoutes.profile)
                ? "ljp-nav-active border-foreground/30 text-foreground"
                : "border-border/50 text-muted-foreground hover:bg-muted/40 hover:text-foreground",
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
