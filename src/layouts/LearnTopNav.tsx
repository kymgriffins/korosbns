"use client";

import Link from "next/link";
import {
  Bell, BookOpen, CheckCircle2, ChevronDown, FileText, LayoutDashboard,
  LogOut, MessagesSquare, Settings, User, KeyRound, HelpCircle, LogIn, ArrowLeft,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import { learnTabToHref } from "@/lib/learn-nav";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { Routes } from "@/constants/routes";
import { Avatar, AvatarFallback } from "@/ui/avatar";

interface NavItem {
  key: LearnTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export function LearnTopNav() {
  const { activeTab, setActiveTab, civicModules, gamification } = useLearn();
  const { isLoggedIn, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const moduleCount = civicModules.length;
  const level = gamification?.level ?? 1;

  const navItems: NavItem[] = [
    { key: "home", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
    { key: "learn", label: "Modules", icon: <CheckCircle2 className="size-4" />, badge: moduleCount > 0 ? String(moduleCount) : undefined },
    { key: "alerts", label: "Alerts", icon: <Bell className="size-4" /> },
    { key: "documents", label: "Documents", icon: <FileText className="size-4" /> },
    { key: "forum", label: "Forums", icon: <MessagesSquare className="size-4" /> },
    { key: "profile", label: "Profile", icon: <User className="size-4" /> },
  ];

  const handleTabChange = (tab: LearnTab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.first_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="hidden md:flex h-14 items-center border-b bg-background px-4 shrink-0 z-20">
      <div className="flex items-center gap-6 w-full">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
          <img src="/logo.svg" alt="BNS" className="h-7 w-auto" width={108} height={28} />
        </Link>

        <nav className="flex items-center gap-0.5 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={learnTabToHref(item.key)}
              onClick={() => handleTabChange(item.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === item.key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="flex h-4.5 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs ring-1 ring-primary/20 ml-0.5">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />

          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted/60"
              >
                <Avatar className="size-7 ring-1 ring-sidebar-border/40">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="size-full rounded-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="flex items-center gap-1 text-xs font-bold text-primary">
                  {level}
                </span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border bg-popover p-1.5 shadow-lg z-50">
                  <div className="px-2.5 py-2 text-xs font-medium text-muted-foreground border-b mb-1">
                    {user?.first_name
                      ? `${user.first_name} ${user.last_name ?? ""}`.trim()
                      : user?.email}
                  </div>
                  <Link
                    href={learnTabToHref("profile")}
                    onClick={() => { setMenuOpen(false); setActiveTab("profile"); }}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <User className="size-4" /> Profile
                  </Link>
                  <Link
                    href={Routes.Account}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <Settings className="size-4" /> Account Settings
                  </Link>
                  <Link
                    href={Routes.AccountPassword}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <KeyRound className="size-4" /> Change Password
                  </Link>
                  <Link
                    href="/help"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <HelpCircle className="size-4" /> Help Center
                  </Link>
                  <div className="border-t mt-1 pt-1">
                    <Link
                      href={Routes.AccountSignOut}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="size-4" /> Sign Out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={Routes.Login}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary ring-1 ring-primary/20 transition-colors hover:bg-primary/15"
            >
              <LogIn className="size-3.5" />
              Sign In
            </Link>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            title="Back to main site"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden xl:inline">Main site</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
