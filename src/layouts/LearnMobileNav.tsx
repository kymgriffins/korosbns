"use client";

import { Bell, BookOpen, Home, UserIcon } from "lucide-react";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import {
  MobileBottomNav,
  type MobileBottomNavItem,
} from "@/ui/mobile-bottom-nav";
import { useAuth } from "@/contexts/auth-context";
import Avatar05 from "@/components/shadcn-space/avatar/avatar-05";

type LearnNavEntry = {
  key: LearnTab;
  label: string;
  Icon: typeof Home;
};

const LEARN_NAV_ITEMS: LearnNavEntry[] = [
  { key: "home", label: "Home", Icon: Home },
  { key: "learn", label: "Learn", Icon: BookOpen },
  { key: "alerts", label: "Alerts", Icon: Bell },
  { key: "profile", label: "Profile", Icon: UserIcon },
];

export function LearnMobileNav() {
  const { activeTab, setActiveTab } = useLearn();
  const { user, isLoggedIn } = useAuth();

  const items: MobileBottomNavItem[] = LEARN_NAV_ITEMS.map(({ key, label, Icon }) => {
    const active = activeTab === key;
    return {
      id: key,
      label,
      onClick: () => setActiveTab(key),
      active,
      ariaCurrent: active ? "page" : undefined,
      icon: key === "profile" && isLoggedIn ? (
        <Avatar05
          src={user?.avatar_url || undefined}
          fallback={(user?.display_name || "U").charAt(0).toUpperCase()}
          size="sm"
          className="size-5"
        />
      ) : (
        <Icon className="size-5" aria-hidden />
      ),
    };
  });

  return (
    <MobileBottomNav
      items={items}
      ariaLabel="Learning hub navigation"
      placement="embedded"
    />
  );
}
