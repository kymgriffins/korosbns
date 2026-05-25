"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { 
  Menu, Search, Trophy, User, Flame, X, ChevronRight, ChevronLeft,
  BookOpen, Sparkles, Settings, Bell, Home, HelpCircle
} from "lucide-react";
import { Routes } from "@/constants/routes";
import { cn } from "@/utils";
import { LearnProvider, useLearn, type LearnTab } from "@/contexts/learn-context";
import { useAuth } from "@/contexts/auth-context";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/ui/button";

function LearnAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    gamification
  } = useLearn();

  // Load collapsed preference on mount
  useEffect(() => {
    const stored = localStorage.getItem("bns_sidebar_collapsed");
    if (stored === "true") {
      setSidebarCollapsed(true);
    }
  }, [setSidebarCollapsed]);

  const toggleSidebar = () => {
    const nextState = !sidebarCollapsed;
    setSidebarCollapsed(nextState);
    localStorage.setItem("bns_sidebar_collapsed", nextState ? "true" : "false");
  };

  const streak = gamification?.streak_days ?? 0;
  const level = gamification?.level ?? 1;
  const points = gamification?.points ?? 0;
  const ringPercent = Math.min(100, points % 100);

  // v1.0.1 Navigation Items
  const navItems: { key: LearnTab; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <Home className="size-5" /> },
    { key: "learn", label: "Learn", icon: <BookOpen className="size-5" /> },
    { key: "alerts", label: "Alerts", icon: <Bell className="size-5" /> },
    { key: "profile", label: "Profile", icon: <User className="size-5" /> },
  ];

  const handleTabChange = (tab: LearnTab) => {
    setActiveTab(tab);
    if (pathname !== "/learn") {
      router.push("/learn");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative overflow-hidden">
      
      {/* 📱 Mobile Top Bar (No hamburger menu as per Mobile-First Directive) */}
      <header className="sticky top-0 z-40 w-full h-14 md:hidden border-b border-border bg-background/85 backdrop-blur-md flex items-center justify-between px-4">
        <Link href={Routes.Home} className="flex items-center gap-2">
          <span className="font-heading font-black text-sm tracking-widest text-primary">BUDGET NDIO STORY</span>
        </Link>

        {/* Mini Streak & Profile */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold">
            <Flame className="size-3.5 fill-orange-500" />
            <span>{streak}d</span>
          </div>

          <button 
            onClick={() => handleTabChange("profile")}
            className="relative size-8 flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold"
          >
            {level}
          </button>
        </div>
      </header>

      {/* 🖥️ Desktop Collapsible Sidebar (Left) — only visible after server login */}
      {isLoggedIn && (
      <aside className={cn(
        "hidden md:flex flex-col justify-between border-r border-border bg-card sticky top-0 h-screen transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex flex-col flex-1 p-4 overflow-y-auto">
          {/* Brand Logo & Collapse Toggle */}
          <div className={cn("flex items-center mb-8", sidebarCollapsed ? "justify-center" : "justify-between")}>
            {sidebarCollapsed ? (
              <img src="/logo.svg" alt="BNS" className="h-6 w-auto" />
            ) : (
              <img src="/logo.svg" alt="Budget Ndio Story" className="h-8 w-auto" />
            )}
            {!sidebarCollapsed && (
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={toggleSidebar}
                className="rounded-xl h-8 w-8 hover:bg-muted"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="size-4" />
              </Button>
            )}
            {sidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-16 size-6 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="size-3" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-0.5" aria-label="Sidebar navigation">
            {!sidebarCollapsed && (
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 pb-2 pt-1">
                Overview
              </p>
            )}
            {navItems.map((item) => {
              const active = activeTab === item.key;
              const isFirstSettings = item.key === "profile";
              return (
                <div key={item.key} className="space-y-1">
                  {!sidebarCollapsed && isFirstSettings && (
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 pb-2 pt-4">
                      Settings
                    </p>
                  )}
                  <button
                    onClick={() => handleTabChange(item.key)}
                    className={cn(
                      "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      sidebarCollapsed ? "justify-center" : "justify-start gap-3"
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.icon}
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {!sidebarCollapsed && active && (
                      <span className="ml-auto size-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                </div>
              );
            })}

          </nav>
        </div>

        {/* Desktop Profile Area */}
        <div className="p-4 border-t border-border">
          <button 
            onClick={() => handleTabChange("profile")}
            className={cn(
              "w-full flex items-center p-2 rounded-xl hover:bg-muted text-left transition-colors",
              sidebarCollapsed ? "justify-center" : "gap-3"
            )}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
              {isLoggedIn && user ? user.email?.charAt(0).toUpperCase() : "B"}
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <p className="text-xs font-semibold truncate">
                  {isLoggedIn && user ? (user.display_name || user.email?.split("@")[0]) : "Citizen Profile"}
                </p>
                <p className="text-[10px] text-muted-foreground">View progress</p>
              </div>
            )}
          </button>
        </div>
      </aside>
      )}

      {/* 🚀 Main Content Canvas */}
      <main className="flex-1 min-h-[calc(100vh-3.5rem)] md:min-h-screen pb-16 md:pb-0 flex flex-col">
        {children}
      </main>

      {/* 📱 Mobile Fixed Bottom Navigation (Bottom navbar ONLY — NO sidebar on mobile) */}
      <nav className="fixed bottom-0 inset-x-0 h-16 bg-background/95 backdrop-blur-md border-t border-border z-40 flex items-center justify-around px-2 md:hidden">
        {navItems.map((item) => {
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center group"
            >
              <div className={cn(
                "p-1 rounded-xl transition-all duration-200",
                active 
                  ? "bg-primary/10 text-primary scale-105" 
                  : "text-muted-foreground group-hover:text-foreground"
              )}>
                {item.icon}
              </div>
              <span className={cn(
                "text-[9px] font-semibold mt-0.5 tracking-tight transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      
    </div>
  );
}

export default function LearnHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <LearnProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }>
        <LearnAppShell>{children}</LearnAppShell>
      </Suspense>
    </LearnProvider>
  );
}
