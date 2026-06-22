"use client";

import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Medal, TrendingUp } from "lucide-react";
import { MobileBottomNav, isMobileNavActive, type MobileBottomNavItem } from "@/ui/mobile-bottom-nav";

export function BudgethubMobileNav() {
  const pathname = usePathname();

  const items: MobileBottomNavItem[] = [
    {
      id: "overview",
      label: "Dashboard",
      href: "/budgethub/dashboard/lms",
      active: isMobileNavActive(pathname, "/budgethub/dashboard/lms", ["/budgethub/dashboard"]),
      icon: <LayoutDashboard className="size-5" aria-hidden />,
    },
    {
      id: "courses",
      label: "Courses",
      href: "/budgethub/dashboard/lms/courses",
      active: pathname.startsWith("/budgethub/dashboard/lms/courses"),
      icon: <BookOpen className="size-5" aria-hidden />,
    },
    {
      id: "progress",
      label: "Progress",
      href: "/budgethub/dashboard/lms/progress",
      prominent: true,
      active: pathname.startsWith("/budgethub/dashboard/lms/progress"),
      icon: <TrendingUp className="size-5" aria-hidden />,
    },
    {
      id: "certificates",
      label: "Badges",
      href: "/budgethub/dashboard/lms/certificates",
      active: pathname.startsWith("/budgethub/dashboard/lms/certificates"),
      icon: <Medal className="size-5" aria-hidden />,
    },
  ];

  return (
    <MobileBottomNav
      items={items}
      ariaLabel="Budgethub navigation"
      placement="embedded"
    />
  );
}
