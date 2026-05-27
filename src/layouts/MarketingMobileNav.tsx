"use client";

import { MARKETING_MOBILE_NAV } from "@/constants/mobile-nav";
import {
  MobileBottomNav,
  isMobileNavActive,
  type MobileBottomNavItem,
} from "@/ui/mobile-bottom-nav";
import { usePathname } from "next/navigation";

type MarketingMobileNavProps = {
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
};

export function MarketingMobileNav({
  menuOpen,
  onMenuToggle,
  onMenuClose,
}: MarketingMobileNavProps) {
  const pathname = usePathname();

  const items: MobileBottomNavItem[] = MARKETING_MOBILE_NAV.map((entry) => {
    const Icon = entry.icon;
    const active = entry.opensMenu
      ? menuOpen ||
        (entry.matchPrefixes?.some((p) => isMobileNavActive(pathname, undefined, [p])) ?? false)
      : isMobileNavActive(pathname, entry.href, entry.matchPrefixes);

    return {
      id: entry.id,
      label: entry.label,
      href: entry.opensMenu ? undefined : entry.href,
      onClick: entry.opensMenu ? onMenuToggle : undefined,
      onNavigate: entry.opensMenu ? undefined : onMenuClose,
      active,
      ariaCurrent: active && !entry.opensMenu ? "page" : undefined,
      ariaExpanded: entry.opensMenu ? menuOpen : undefined,
      icon: <Icon className="size-5" aria-hidden />,
    };
  });

  return <MobileBottomNav items={items} ariaLabel="Primary site navigation" />;
}
