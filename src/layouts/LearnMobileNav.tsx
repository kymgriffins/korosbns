"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLearn } from "@/contexts/learn-context";
import {
  MobileBottomNav,
  type MobileBottomNavItem,
} from "@/components/ui/mobile-bottom-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { learnMobileNavItems } from "@/lib/learn-shell-nav";
import { isLearnNavHrefActive } from "@/lib/learn-nav";
import { usePathname, useSearchParams } from "next/navigation";

type StoredProfile = {
  breakName?: string;
  avatar_url?: string | null;
};

function getDisplayName(
  user: ReturnType<typeof useAuth>["user"],
  profile: StoredProfile | null,
) {
  if (user) {
    const full = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
    return user.display_name || user.break_name || full || user.email || "";
  }
  return profile?.breakName ?? "";
}

export function LearnMobileNav() {
  const { activeTab, setActiveTab } = useLearn();
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [profile, setProfile] = useState<StoredProfile | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("bns_user_profile");
        if (raw) setProfile(JSON.parse(raw));
      } catch {
        // ignore
      }
    };
    read();
    window.addEventListener("storage", read);
    window.addEventListener("bns-profile-updated", read);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("bns-profile-updated", read);
    };
  }, []);

  const displayName = getDisplayName(user, profile);
  const avatarUrl = user?.avatar_url ?? profile?.avatar_url ?? null;
  const initials = displayName
    ? displayName
        .split(" ")
        .map((p) => p[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const items: MobileBottomNavItem[] = learnMobileNavItems().map((nav) => {
    const isActive =
      (nav.tab ? activeTab === nav.tab : false) ||
      isLearnNavHrefActive(pathname, tabParam, nav.href);
    const Icon = nav.icon;

    if (nav.id === "profile") {
      return {
        id: nav.id,
        label: nav.shortLabel,
        href: nav.href,
        active: isActive,
        ariaCurrent: isActive ? "page" : undefined,
        icon: (
          <Avatar
            className={
              isActive
                ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                : ""
            }
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName || "Profile"}
                width={32}
                height={32}
                className="size-full rounded-full object-cover"
                unoptimized
              />
            ) : (
              <AvatarFallback
                className={
                  isActive
                    ? "bg-primary text-[10px] font-bold text-primary-foreground"
                    : "bg-muted text-[10px] font-bold text-muted-foreground"
                }
              >
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
        ),
        onNavigate: () => setActiveTab("profile"),
        prominent: false,
      };
    }

    return {
      id: nav.id,
      label: nav.shortLabel,
      href: nav.href,
      active: isActive,
      prominent: nav.id === "modules",
      ariaCurrent: isActive ? "page" : undefined,
      icon: <Icon className="size-5" aria-hidden />,
      onNavigate: nav.tab ? () => setActiveTab(nav.tab!) : undefined,
    };
  });

  return (
    <MobileBottomNav
      items={items}
      ariaLabel="Learning hub navigation"
      placement="fixed"
    />
  );
}
