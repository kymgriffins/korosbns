"use client";

import { useEffect, useState } from "react";
import { BookOpen, FileText, LayoutDashboard, MessagesSquare } from "lucide-react";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import { learnTabToHref } from "@/lib/learn-nav";
import {
  MobileBottomNav,
  type MobileBottomNavItem,
} from "@/components/ui/mobile-bottom-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type StoredProfile = {
  breakName?: string;
  gender?: string;
  participationLogs?: unknown[];
  avatar_url?: string | null;
};

export function LearnMobileNav() {
  const { activeTab, setActiveTab } = useLearn();
  const onNav = (tab: LearnTab) => () => setActiveTab(tab);
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

  const initials = profile?.breakName
    ? profile.breakName.split(" ").map(p => p[0] ?? "").join("").slice(0, 2).toUpperCase()
    : "?";

  const profileIcon = (
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
  );

  const items: MobileBottomNavItem[] = [
    {
      id: "home",
      label: "Chamber",
      href: learnTabToHref("home"),
      active: activeTab === "home",
      ariaCurrent: activeTab === "home" ? "page" : undefined,
      icon: <LayoutDashboard className="size-5" aria-hidden />,
      onNavigate: onNav("home"),
    },
    {
      id: "documents",
      label: "Documents",
      href: learnTabToHref("documents"),
      active: activeTab === "documents",
      ariaCurrent: activeTab === "documents" ? "page" : undefined,
      icon: <FileText className="size-5" aria-hidden />,
      onNavigate: onNav("documents"),
    },
    {
      id: "learn",
      label: "Path",
      href: learnTabToHref("learn"),
      active: activeTab === "learn",
      prominent: true,
      ariaCurrent: activeTab === "learn" ? "page" : undefined,
      icon: <BookOpen className="size-5" aria-hidden />,
      onNavigate: onNav("learn"),
    },
    {
      id: "forum",
      label: "Forums",
      href: learnTabToHref("forum"),
      active: activeTab === "forum",
      ariaCurrent: activeTab === "forum" ? "page" : undefined,
      icon: <MessagesSquare className="size-5" aria-hidden />,
      onNavigate: onNav("forum"),
    },
    {
      id: "profile",
      label: "Profile",
      href: learnTabToHref("profile"),
      active: activeTab === "profile",
      ariaCurrent: activeTab === "profile" ? "page" : undefined,
      icon: profileIcon,
      onNavigate: onNav("profile"),
    },
  ];

  return (
    <MobileBottomNav
      items={items}
      ariaLabel="Learning hub navigation"
      placement="fixed"
    />
  );
}
