"use client";

import { Bell, BookOpen, Home, User, LayoutDashboard } from "lucide-react";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import {
  MobileBottomNav,
  type MobileBottomNavItem,
} from "@/ui/mobile-bottom-nav";

type LearnNavEntry = {
  key: LearnTab;
  label: string;
  Icon: typeof Home;
};

const LEARN_NAV_ITEMS: LearnNavEntry[] = [
  { key: "home", label: "Dashboard", Icon: LayoutDashboard },
  { key: "learn", label: "Learn", Icon: BookOpen },
  { key: "alerts", label: "Alerts", Icon: Bell },
  { key: "profile", label: "Profile", Icon: User },
];

export function LearnMobileNav() {
  const { activeTab, setActiveTab } = useLearn();

  const items: MobileBottomNavItem[] = [
    {
      id: "site-home",
      label: "Home",
      href: "/",
      icon: <Home className="size-5" aria-hidden />,
    },
    ...LEARN_NAV_ITEMS.map(({ key, label, Icon }) => {
      const active = activeTab === key;
      return {
        id: key,
        label,
        onClick: () => setActiveTab(key),
        active,
        prominent: key === "learn",
        ariaCurrent: active ? "page" : undefined,
        icon: <Icon className="size-5" aria-hidden />,
      } as MobileBottomNavItem;
    }),
  ];

  return (
    <MobileBottomNav
      items={items}
      ariaLabel="Learning hub navigation"
      placement="embedded"
    />
  );
}
