"use client";

import { useEffect, useState } from "react";
import { Bell, BookOpen, FileText, LayoutDashboard } from "lucide-react";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import {
  MobileBottomNav,
  type MobileBottomNavItem,
} from "@/ui/mobile-bottom-nav";
import { Avatar, AvatarFallback } from "@/ui/avatar";

type StoredProfile = {
  breakName?: string;
  gender?: string;
  participationLogs?: unknown[];
  avatar_url?: string | null;
};

export function LearnMobileNav() {
  const { activeTab, setActiveTab } = useLearn();
  const [profile, setProfile] = useState<StoredProfile | null>(null);

  // Read profile from localStorage (updated by learn-paths-home)
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

  // Derive initials for avatar
  const initials = profile?.breakName
    ? profile.breakName.split(" ").map(p => p[0] ?? "").join("").slice(0, 2).toUpperCase()
    : "?";

  // Count alerts from participation logs
  const alertCount = (profile?.participationLogs ?? []).length;
  const hasAlerts = alertCount > 0;

  const profileIcon = (
    <span className="relative inline-flex">
      <Avatar
        className={
          activeTab === "profile"
            ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
            : ""
        }
      >
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="size-full rounded-full object-cover" />
        ) : (
          <AvatarFallback
            className={
              activeTab === "profile"
                ? "bg-primary text-primary-foreground text-[10px] font-black"
                : "bg-muted text-muted-foreground text-[10px] font-black"
            }
          >
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      {hasAlerts && (
        <span className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-red-500 border-2 border-background flex items-center justify-center">
          <span className="text-[7px] font-black text-white leading-none">
            {alertCount > 9 ? "9+" : alertCount}
          </span>
        </span>
      )}
    </span>
  );

  const items: MobileBottomNavItem[] = [
    {
      id: "home",
      label: "Dashboard",
      onClick: () => setActiveTab("home"),
      active: activeTab === "home",
      ariaCurrent: activeTab === "home" ? "page" : undefined,
      icon: <LayoutDashboard className="size-5" aria-hidden />,
    },
    {
      id: "documents",
      label: "Documents",
      onClick: () => setActiveTab("documents"),
      active: activeTab === "documents",
      ariaCurrent: activeTab === "documents" ? "page" : undefined,
      icon: <FileText className="size-5" aria-hidden />,
    },
    {
      id: "learn",
      label: "Learn",
      onClick: () => setActiveTab("learn"),
      active: activeTab === "learn",
      prominent: true,
      ariaCurrent: activeTab === "learn" ? "page" : undefined,
      icon: <BookOpen className="size-5" aria-hidden />,
    },
    {
      id: "alerts",
      label: "Alerts",
      onClick: () => setActiveTab("alerts"),
      active: activeTab === "alerts",
      ariaCurrent: activeTab === "alerts" ? "page" : undefined,
      icon: <Bell className="size-5" aria-hidden />,
    },
    {
      id: "profile",
      label: "Profile",
      onClick: () => setActiveTab("profile"),
      active: activeTab === "profile",
      ariaCurrent: activeTab === "profile" ? "page" : undefined,
      icon: profileIcon,
    },
  ];

  return (
    <MobileBottomNav
      items={items}
      ariaLabel="Learning hub navigation"
      placement="embedded"
    />
  );
}
