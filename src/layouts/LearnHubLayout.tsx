"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { 
  Menu, Search, Trophy, User, Flame, X, ChevronRight, 
  BookOpen, Sparkles, MessageSquare, PenTool, Settings, ClipboardList
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
    sidebarOpen,
    setSidebarOpen,
    rightDrawerOpen,
    setRightDrawerOpen,
    gamification,
    activeModule
  } = useLearn();

  const [notesText, setNotesText] = useState("");

  const points = gamification?.points ?? 0;
  const level = gamification?.level ?? 1;
  const streak = gamification?.streak_days ?? 0;
  const nextLevelXp = level * 100;
  const currentLevelProgress = points % 100;
  const ringPercent = Math.min(100, currentLevelProgress);

  // Tabs configurations
  const mobileNavItems: { key: LearnTab; label: string; icon: React.ReactNode }[] = [
    { key: "hub", label: "Hub", icon: <BookOpen className="size-5" /> },
    { key: "search", label: "Search", icon: <Search className="size-5" /> },
    { key: "leaderboard", label: "Leaderboard", icon: <Trophy className="size-5" /> },
    { key: "profile", label: "Profile", icon: <User className="size-5" /> },
  ];

  const sidebarNavItems: { key: LearnTab; label: string; icon: React.ReactNode }[] = [
    { key: "hub", label: "Hub", icon: <BookOpen className="size-5" /> },
    { key: "paths", label: "Paths", icon: <ClipboardList className="size-5" /> },
    { key: "documents", label: "Documents", icon: <Sparkles className="size-5" /> },
    { key: "quests", label: "Quests", icon: <Flame className="size-5" /> },
    { key: "settings", label: "Settings", icon: <Settings className="size-5" /> },
  ];

  const handleTabChange = (tab: LearnTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    if (pathname !== "/learn") {
      router.push("/learn");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative overflow-hidden">
      {/* 📱 Mobile Top Bar */}
      <header className="sticky top-0 z-40 w-full h-14 md:hidden border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </Button>
          <Link href={Routes.Home} className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm tracking-tight text-primary">BNS LEARN</span>
          </Link>
        </div>

        {/* Gamified Mini Ring & Streak */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold">
            <Flame className="size-3.5 fill-orange-500" />
            <span>{streak}d</span>
          </div>

          <button 
            onClick={() => handleTabChange("profile")}
            className="relative size-9 flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            {/* SVG circular ring */}
            <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted/10"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary transition-all duration-500"
                strokeWidth="2.5"
                strokeDasharray={`${ringPercent}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-[10px] font-bold text-primary">{level}</span>
          </button>
        </div>
      </header>

      {/* 🖥️ Sidebar (Fixed Left, Desktop; Slide-out drawer on Mobile) */}
      <AnimatePresence>
        {(sidebarOpen || (typeof window === "undefined" || window.innerWidth >= 1024)) && (
          <>
            {/* Backdrop overlay on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden"
            />

            {/* Sidebar drawer container */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:w-64 border-r border-border bg-card lg:bg-background lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between"
            >
              <div className="flex flex-col flex-1 p-6 overflow-y-auto">
                {/* Logo Section */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-heading font-black tracking-wider text-primary">
                      BUDGET NDIO STORY
                    </span>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden"
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                {/* Gamified stats panel */}
                {isLoggedIn && (
                  <div className="p-4 rounded-2xl border border-primary/10 bg-primary/[0.02] mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground">LVL {level}</span>
                      <span className="text-xs font-bold text-primary">{currentLevelProgress} / 100 XP</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500" 
                        style={{ width: `${ringPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Flame className="size-4 text-orange-500 fill-orange-500" />
                        <span className="font-bold">{streak} Day Streak</span>
                      </div>
                      <div className="text-xs text-muted-foreground">🔥 keeping hot</div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-1" aria-label="Sidebar navigation">
                  {sidebarNavItems.map((item) => {
                    const active = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleTabChange(item.key)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                          active
                            ? "bg-primary/15 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.02]"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {item.icon}
                          {item.label}
                        </span>
                        <ChevronRight className={cn("size-4 transition-opacity", active ? "opacity-100" : "opacity-0")} />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar bottom profile button */}
              <div className="p-4 border-t border-border">
                {isLoggedIn && user ? (
                  <button 
                    onClick={() => handleTabChange("profile")}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-foreground/[0.02] text-left transition-colors"
                  >
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold truncate max-w-[120px]">{user.display_name || user.email?.split("@")[0]}</p>
                      <p className="text-[10px] text-muted-foreground">View profile</p>
                    </div>
                  </button>
                ) : (
                  <Link href={Routes.Login} className="w-full">
                    <Button variant="default" className="w-full rounded-xl">Sign In</Button>
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 🚀 Main Scrollable Content Canvas */}
      <main className="flex-1 min-h-[calc(100vh-3.5rem)] md:min-h-screen pb-16 md:pb-0 flex flex-col">
        {children}
      </main>

      {/* 📱 Mobile Fixed Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 h-16 bg-background/95 backdrop-blur-md border-t border-border z-40 flex items-center justify-around px-2 md:hidden">
        {mobileNavItems.map((item) => {
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center group"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300",
                active 
                  ? "bg-primary/10 text-primary scale-110" 
                  : "text-muted-foreground group-hover:text-foreground active:scale-95"
              )}>
                {item.icon}
              </div>
              <span className={cn(
                "text-[10px] font-semibold mt-0.5 tracking-tight transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 🖥️ Collapsible Right Drawer (Chat/Notes) */}
      <div className="hidden xl:flex sticky top-0 h-screen border-l border-border bg-card/40 w-80 flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm flex items-center gap-2">
            <PenTool className="size-4 text-primary" /> Notes
          </h3>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">saved locally</span>
        </div>
        <div className="flex-1 p-6 flex flex-col gap-4">
          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Jot down notes about what you learn here..."
            className="w-full flex-1 rounded-2xl border border-border bg-muted/40 p-4 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}

export default function LearnHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <LearnProvider>
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full" /></div>}>
        <LearnAppShell>{children}</LearnAppShell>
      </Suspense>
    </LearnProvider>
  );
}
