"use client";

import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Settings, TrendingUp, User } from "lucide-react";
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
      active: pathname.startsWith("/budgethub/dashboard/lms/progress") || pathname.startsWith("/budgethub/dashboard/lms/certificates"),
      icon: <TrendingUp className="size-5" aria-hidden />,
    },
    {
      id: "profile",
      label: "Profile",
      href: "/budgethub/dashboard/lms/profile",
      active: pathname.startsWith("/budgethub/dashboard/lms/profile"),
      icon: <User className="size-5" aria-hidden />,
    },
    {
      id: "account",
      label: "Settings",
      href: "/budgethub/dashboard/lms/account",
      active: pathname.startsWith("/budgethub/dashboard/lms/account"),
      icon: <Settings className="size-5" aria-hidden />,
    },
  ];

  return (
    <MobileBottomNav
      items={items}
      ariaLabel="Budgethub navigation"
      placement="fixed"
    />
  );
}
