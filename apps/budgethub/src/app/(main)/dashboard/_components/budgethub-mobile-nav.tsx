"use client";

import { usePathname } from "next/navigation";
import { BookOpen, FileBarChart, FileText, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { getInitials } from "@/lib/utils";
import { MobileBottomNav, isMobileNavActive, type MobileBottomNavItem } from "@/ui/mobile-bottom-nav";

export function BudgethubMobileNav() {
  const pathname = usePathname();
  const { user: authUser } = useAuth();
  const avatarUrl = authUser?.avatar_url || authUser?.avatar || "";
  const displayName = authUser?.display_name || [authUser?.first_name, authUser?.last_name].filter(Boolean).join(" ") || "User";

  const items: MobileBottomNavItem[] = [
    {
      id: "overview",
      label: "Dashboard",
      href: "/budgethub/dashboard/lms",
      active: isMobileNavActive(pathname, "/budgethub/dashboard/lms", ["/budgethub/dashboard"]),
      icon: <LayoutDashboard className="size-5" aria-hidden />,
    },
    {
      id: "documents",
      label: "Documents",
      href: "/budgethub/dashboard/lms/documents",
      active: pathname.startsWith("/budgethub/dashboard/lms/documents"),
      icon: <FileText className="size-5" aria-hidden />,
    },
    {
      id: "courses",
      label: "Courses",
      href: "/budgethub/dashboard/lms/courses",
      prominent: true,
      active: pathname.startsWith("/budgethub/dashboard/lms/courses"),
      icon: <BookOpen className="size-5" aria-hidden />,
    },
    {
      id: "profile",
      label: "Profile",
      href: "/budgethub/dashboard/lms/profile",
      active: pathname.startsWith("/budgethub/dashboard/lms/profile"),
      icon: (
        <Avatar className="size-5">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="text-[8px]">{getInitials(displayName)}</AvatarFallback>
        </Avatar>
      ),
    },
    {
      id: "reports",
      label: "Reports",
      href: "/budgethub/reports",
      active: pathname.startsWith("/budgethub/reports"),
      icon: <FileBarChart className="size-5" aria-hidden />,
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
