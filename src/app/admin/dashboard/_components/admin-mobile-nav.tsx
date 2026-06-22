"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { getInitials } from "@/lib/utils";
import { MobileBottomNav, isMobileNavActive, type MobileBottomNavItem } from "@/ui/mobile-bottom-nav";

export function AdminMobileNav() {
  const pathname = usePathname();
  const { user: authUser } = useAuth();
  const avatarUrl = authUser?.avatar_url || authUser?.avatar || "";
  const displayName = authUser?.display_name || [authUser?.first_name, authUser?.last_name].filter(Boolean).join(" ") || "User";

  const items: MobileBottomNavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/default",
      active: isMobileNavActive(pathname, "/dashboard/default", ["/dashboard"]),
      icon: <LayoutDashboard className="size-5" aria-hidden />,
    },
    {
      id: "users",
      label: "Users",
      href: "/dashboard/users",
      active: pathname.startsWith("/dashboard/users"),
      icon: <Users className="size-5" aria-hidden />,
    },
    {
      id: "profile",
      label: "Profile",
      href: "/dashboard/default",
      active: pathname.startsWith("/dashboard/default"),
      icon: (
        <Avatar className="size-5">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="text-[8px]">{getInitials(displayName)}</AvatarFallback>
        </Avatar>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      href: "#",
      active: false,
      icon: <Settings className="size-5" aria-hidden />,
    },
  ];

  return (
    <MobileBottomNav
      items={items}
      ariaLabel="Admin navigation"
      placement="fixed"
    />
  );
}
