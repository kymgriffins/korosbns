/**
 * @sdp-provenance
 * intent: INTENT-001
 * capability: CAP-learning-shell
 * requirements: REQ-0003
 * contracts: CTR-lms-shell@1.0.0
 * builder: SDP-Builder
 * date: 2026-07-07
 */
"use client";

import { usePathname } from "next/navigation";
import { BookOpen, Home, Target, Trophy, User } from "lucide-react";
import { isLmsNavActive, lmsNavToHref } from "@/lib/learn-nav";
import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";

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
      active:
        isLmsNavActive(pathname, lmsNavToHref("learn")) || pathname.includes("/courses/"),
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
      ariaCurrent: isLmsNavActive(pathname, lmsNavToHref("achievements"))
        ? ("page" as const)
        : undefined,
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
