"use client";

import { usePathname } from "next/navigation";
import { BookOpen, FileText, Home, LayoutDashboard, MessageSquare, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { getInitials } from "@/lib/utils";
import { MobileBottomNav, isMobileNavActive, type MobileBottomNavItem } from "@/ui/mobile-bottom-nav";

export function LearnMobileNav() {
  const pathname = usePathname();
  const { user: authUser } = useAuth();
  const avatarUrl = authUser?.avatar_url || authUser?.avatar || "";
  const displayName = authUser?.display_name || [authUser?.first_name, authUser?.last_name].filter(Boolean).join(" ") || "User";

  const items: MobileBottomNavItem[] = [
    {
      id: "home",
      label: "Home",
      href: "/learn",
      active: isMobileNavActive(pathname, "/learn", ["/learn"]),
      icon: <LayoutDashboard className="size-5" aria-hidden />,
    },
    {
      id: "modules",
      label: "Modules",
      href: "/learn/modules",
      active: pathname.startsWith("/learn/modules"),
      icon: <BookOpen className="size-5" aria-hidden />,
    },
    {
      id: "browse",
      label: "Browse",
      href: "/learn/articles",
      prominent: true,
      active: pathname.startsWith("/learn/articles") || pathname.startsWith("/learn/videos") || pathname.startsWith("/learn/stories"),
      icon: <Home className="size-5" aria-hidden />,
    },
    {
      id: "forum",
      label: "Forum",
      href: "/learn/forum",
      active: pathname.startsWith("/learn/forum"),
      icon: <MessageSquare className="size-5" aria-hidden />,
    },
    {
      id: "profile",
      label: "Profile",
      href: "/learn/profile",
      active: pathname.startsWith("/learn/profile"),
      icon: (
        <Avatar className="size-5">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="text-[9px] font-medium">{getInitials(displayName)}</AvatarFallback>
        </Avatar>
      ),
    },
  ];

  return (
    <MobileBottomNav
      items={items}
      ariaLabel="Learn hub navigation"
      placement="fixed"
    />
  );
}
