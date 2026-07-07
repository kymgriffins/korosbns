"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Home,
  Search,
  Target,
  Trophy,
  User,
} from "lucide-react";
import { LmsRoutes } from "@/data/lms/routes";
import { isLmsNavActive, lmsNavToHref } from "@/lib/learn-nav";
import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";
import { cn } from "@/utils";

const DESKTOP_LINKS = [
  { label: "Courses", href: LmsRoutes.catalogue },
  { label: "Discover", href: LmsRoutes.catalogue },
  { label: "My Learning", href: LmsRoutes.progress },
  { label: "Achievements", href: LmsRoutes.achievements },
] as const;

export function LmsTopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 hidden border-b border-border/60 bg-background/90 backdrop-blur-md lg:block">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        <Link href={LmsRoutes.home} className="shrink-0">
          <Image src="/logo.svg" alt="Budget Ndio Story" width={120} height={32} className="h-7 w-auto" />
        </Link>

        <nav className="flex flex-1 items-center gap-1" aria-label="Learn navigation">
          {DESKTOP_LINKS.map((item) => {
            const active = isLmsNavActive(pathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
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
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full border transition-colors",
              isLmsNavActive(pathname, LmsRoutes.profile)
                ? "border-primary bg-primary/10 text-primary"
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

export function LmsBottomNav() {
  const pathname = usePathname();

  const items = [
    {
      id: "home",
      label: "Home",
      href: lmsNavToHref("home"),
      icon: <Home className="size-5" />,
      active: isLmsNavActive(pathname, lmsNavToHref("home")),
      ariaCurrent: isLmsNavActive(pathname, lmsNavToHref("home")) ? ("page" as const) : undefined,
    },
    {
      id: "learn",
      label: "Learn",
      href: lmsNavToHref("learn"),
      icon: <BookOpen className="size-5" />,
      active: isLmsNavActive(pathname, lmsNavToHref("learn")) || pathname.includes("/courses/"),
      ariaCurrent:
        isLmsNavActive(pathname, lmsNavToHref("learn")) || pathname.includes("/courses/")
          ? ("page" as const)
          : undefined,
    },
    {
      id: "progress",
      label: "Progress",
      href: lmsNavToHref("progress"),
      icon: <Target className="size-5" />,
      active: isLmsNavActive(pathname, lmsNavToHref("progress")),
      ariaCurrent: isLmsNavActive(pathname, lmsNavToHref("progress")) ? ("page" as const) : undefined,
    },
    {
      id: "achievements",
      label: "Achievements",
      href: lmsNavToHref("achievements"),
      icon: <Trophy className="size-5" />,
      active: isLmsNavActive(pathname, lmsNavToHref("achievements")),
      ariaCurrent: isLmsNavActive(pathname, lmsNavToHref("achievements")) ? ("page" as const) : undefined,
    },
    {
      id: "profile",
      label: "Profile",
      href: lmsNavToHref("profile"),
      icon: <User className="size-5" />,
      active: isLmsNavActive(pathname, lmsNavToHref("profile")),
      ariaCurrent: isLmsNavActive(pathname, lmsNavToHref("profile")) ? ("page" as const) : undefined,
    },
  ];

  return <MobileBottomNav items={items} ariaLabel="Learn" placement="embedded" />;
}
