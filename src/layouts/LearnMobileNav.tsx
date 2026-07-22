"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BookOpen, FileText, MessagesSquare } from "lucide-react";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import { learnTabToHref } from "@/lib/learn-nav";
import {
  MobileBottomNav,
  type MobileBottomNavItem,
} from "@/components/ui/mobile-bottom-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";

type StoredProfile = {
  breakName?: string;
  gender?: string;
  participationLogs?: unknown[];
  avatar_url?: string | null;
};

function getDisplayName(
  user: ReturnType<typeof useAuth>["user"],
  profile: StoredProfile | null
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

  const displayName = getDisplayName(user, profile);
  const avatarUrl = user?.avatar_url ?? profile?.avatar_url ?? null;
  const initials = displayName
    ? displayName.split(" ").map((p) => p[0] ?? "").join("").slice(0, 2).toUpperCase()
    : "?";

  const profileIcon = (
    <Avatar
      className={
        activeTab === "profile"
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
      id: "learn",
      label: "Modules",
      href: learnTabToHref("learn"),
      active: activeTab === "learn" || activeTab === "home",
      prominent: true,
      ariaCurrent: activeTab === "learn" || activeTab === "home" ? "page" : undefined,
      icon: <BookOpen className="size-5" aria-hidden />,
      onNavigate: onNav("learn"),
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
      placement="embedded"
    />
  );
}
