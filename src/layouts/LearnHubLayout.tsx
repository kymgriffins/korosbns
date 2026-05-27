"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { 
  User, ChevronRight, ChevronLeft,
  BookOpen, Bell, Home, CheckCircle2, ArrowLeft
} from "lucide-react";
import { cn } from "@/utils";
import { LearnProvider, useLearn, type LearnTab } from "@/contexts/learn-context";
import { useAuth } from "@/contexts/auth-context";
import { useStages } from "@/lib/use-stages";
import { Button } from "@/ui/button";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";

function LearnAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { data: stages } = useStages();

  const sortedStages = (stages ?? []).sort((a, b) => a.order - b.order);
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    gamification,
    activeLesson,
  } = useLearn();

  useEffect(() => {
    const stored = localStorage.getItem("bns_sidebar_collapsed");
    if (stored === "true") {
      setSidebarCollapsed(true);
    }
  }, [setSidebarCollapsed]);

  useEffect(() => {
    const isMobileDevice = () => window.innerWidth < 768;

    const lockBody = () => {
      if (isMobileDevice()) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    };

    lockBody();
    window.addEventListener("resize", lockBody);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("resize", lockBody);
    };
  }, []);

  const toggleSidebar = () => {
    const nextState = !sidebarCollapsed;
    setSidebarCollapsed(nextState);
    localStorage.setItem("bns_sidebar_collapsed", nextState ? "true" : "false");
  };

  const level = gamification?.level ?? 1;

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

  /* If an active lesson is set, we'll render a curriculum rail */
  const showCurriculum = !!activeLesson;

  return (
    <div className="h-dvh md:min-h-screen md:h-auto bg-background text-foreground flex flex-col md:flex-row relative overflow-hidden md:overflow-x-hidden">
      
      {/* 🖥️ Desktop Sidebar — dual-mode (nav / curriculum rail) 320px */}
      {isLoggedIn && (
      <aside className={cn(
        "hidden md:flex flex-col border-r border-border bg-card sticky top-0 h-screen transition-all duration-300",
        "w-80"
      )}>
        {showCurriculum ? (
          /* ── CURRICULUM RAIL MODE ── */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Back to dashboard */}
            <div className="p-3 border-b border-border">
              <button
                onClick={() => {
                  /* Clear active lesson — handled by learn-paths-home through onClose */
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-4" />
                Back to Dashboard
              </button>
            </div>

            {/* Active stage header */}
            <div className="p-4 border-b border-border bg-primary/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{activeLesson.stageBadge}</span>
                <h3 className="text-xs font-black uppercase leading-tight">{activeLesson.stageTitle}</h3>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {activeLesson.completedStepIds.length} / {activeLesson.totalSteps} steps completed
              </p>
            </div>

            {/* Step list */}

            <nav className="flex-1 overflow-y-auto p-2 space-y-0.5" aria-label="Curriculum steps">
              {activeLesson.stepTitles.map((step, i) => {
                const stepNum = i + 1;
                const isComplete = activeLesson.completedStepIds.includes(step.id);
                const isActive = activeLesson.currentStep === stepNum;
                return (
                  <button
                    key={step.id}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-all",
                      isActive
                        ? "bg-primary/10 text-primary font-bold"
                        : isComplete
                          ? "text-muted-foreground/60"
                          : "text-muted-foreground hover:bg-muted/40"
                    )}
                  >
                    <div className={cn(
                      "size-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 border",
                      isComplete
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : isActive
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-muted border-border text-muted-foreground"
                    )}>
                      {isComplete ? <CheckCircle2 className="size-3" /> : stepNum}
                    </div>
                    <span className="truncate">{step.title}</span>
                  </button>
                );
              })}
            </nav>

            {/* All stages compact list */}
            <div className="border-t border-border p-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2 px-1">
                All Stages
              </p>
              <div className="space-y-0.5">
                {sortedStages.map((s) => {
                  const isCurrent = s.order === activeLesson.stageId;
                  return (
                    <div
                      key={s.id}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs",
                        isCurrent
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-muted-foreground"
                      )}
                    >
                      <span className="text-sm">{s.badge}</span>
                      <span className="truncate text-[11px]">{isCurrent ? s.title : s.title}</span>
                      {isCurrent && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ── DASHBOARD NAV MODE ── */
          <div className="flex flex-col flex-1 p-4 overflow-y-auto">
            {/* Brand Logo & Toggle */}
            <div className="flex items-center justify-between mb-8">
              <img src="/logo.svg" alt="Budget Ndio Story" className="h-8 w-auto" />
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

            {/* Collapsed bottom badge */}
            {sidebarCollapsed && (
              <div className="mt-auto flex justify-center">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {level}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Desktop Profile Area (only in nav mode) */}
        {!showCurriculum && !sidebarCollapsed && (
          <div className="p-4 border-t border-border">
            <button 
              onClick={() => handleTabChange("profile")}
              className={cn(
                "w-full flex items-center p-2 rounded-xl hover:bg-muted text-left transition-colors",
                "gap-3"
              )}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                {isLoggedIn && user ? user.email?.charAt(0).toUpperCase() : "B"}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold truncate">
                  {isLoggedIn && user ? (user.display_name || user.email?.split("@")[0]) : "Citizen Profile"}
                </p>
                <p className="text-[10px] text-muted-foreground">View progress</p>
              </div>
            </button>
          </div>
        )}
      </aside>
      )}

      {/* Main content canvas — viewport-locked on mobile; no page scroll */}
      <div className="flex-1 flex flex-col min-h-0 h-full md:h-auto overflow-hidden">
        <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {children}
        </main>

        {/* Learn hub mobile bottom nav — always visible, in-flow */}
        <LearnMobileNav />
      </div>

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
