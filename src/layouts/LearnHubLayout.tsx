"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { 
  User, ChevronRight, ChevronLeft, ChevronDown,
  BookOpen, Bell, Home, LayoutDashboard, CheckCircle2, ArrowLeft, ExternalLink,
  Settings, LogOut, KeyRound, Palette, LogIn
} from "lucide-react";
import { cn } from "@/utils";
import { LearnProvider, useLearn, type LearnTab } from "@/contexts/learn-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/ui/button";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";
import { Routes } from "@/constants/routes";

const ALL_STAGES = [
  { id: 1, badge: "🛡️", title: "Constitution" },
  { id: 2, badge: "⚖️", title: "Budget Policy Statement" },
  { id: 3, badge: "🏗️", title: "Infrastructure Fund" },
];

function LearnAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
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
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems: { key: LearnTab; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
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
    <div className="h-dvh md:min-h-screen bg-background text-foreground overflow-hidden">
      
      {/* 🖥️ Desktop Sidebar — fixed, independent of main flow */}
      <aside className={cn(
        "hidden md:flex flex-col fixed left-0 top-0 h-screen z-30 border-r border-border bg-card overflow-hidden transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-80"
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

            <div className="border-t border-border p-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2 px-1">
                All Stages
              </p>
              <div className="space-y-0.5">
                {ALL_STAGES.map((s) => {
                  const isCurrent = s.id === activeLesson.stageId;
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
          <div className="flex flex-col flex-1 p-4 overflow-hidden">
            {/* Brand Logo & Toggle */}
            <div className="flex items-center justify-between mb-8">
              <Link href={"/"} className="hover:opacity-80 transition-opacity">
                <img src="/logo.svg" alt="Budget Ndio Story" className="h-8 w-auto" />
              </Link>
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
                const isProfile = item.key === "profile";
                return (
                  <div key={item.key} className="space-y-1">
                    {!sidebarCollapsed && isProfile && (
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 pb-2 pt-4">
                        Settings
                      </p>
                    )}
                    {isProfile && !sidebarCollapsed ? (
                      <>
                        <button
                          onClick={() => setProfileOpen((p) => !p)}
                          className={cn(
                            "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                            profileOpen
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                            "justify-start gap-3"
                          )}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                          <ChevronDown className={cn("size-4 ml-auto transition-transform duration-200", profileOpen && "rotate-180")} />
                        </button>
                        {profileOpen && (
                          <div className="ml-2 space-y-0.5 border-l-2 border-border pl-3">
                            <button
                              onClick={() => handleTabChange("profile")}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                activeTab === "profile"
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              )}
                            >
                              <User className="size-4" />
                              <span>Learner Profile</span>
                            </button>
                            {isLoggedIn ? (
                              <>
                                <Link
                                  href={Routes.Account}
                                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                                >
                                  <Settings className="size-4" />
                                  <span>Account Settings</span>
                                </Link>
                                <Link
                                  href={Routes.AccountPassword}
                                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                                >
                                  <KeyRound className="size-4" />
                                  <span>Change Password</span>
                                </Link>
                                <Link
                                  href={Routes.AccountSignOut}
                                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                                >
                                  <LogOut className="size-4" />
                                  <span>Sign Out</span>
                                </Link>
                              </>
                            ) : (
                              <Link
                                href={Routes.Login}
                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-primary hover:text-primary/80 hover:bg-primary/[0.06] transition-all duration-200"
                              >
                                <LogIn className="size-4" />
                                <span>Sign In</span>
                              </Link>
                            )}
                            <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground">
                              <Palette className="size-4" />
                              <span className="flex-1">Theme</span>
                              <ThemeToggle />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          if (isProfile) setProfileOpen((p) => !p);
                          else handleTabChange(item.key);
                        }}
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
                      </button>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Collapsed bottom */}
            {sidebarCollapsed && (
              <div className="mt-auto flex flex-col items-center gap-3">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="size-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  title="Profile menu"
                >
                  <User className="size-4" />
                </button>
                {!isLoggedIn && (
                  <Link href={Routes.Login} className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors" title="Sign In">
                    <LogIn className="size-4" />
                  </Link>
                )}
                <Link href={"/"} className="size-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors" title="Main site">
                  <Home className="size-4" />
                </Link>
                {isLoggedIn && (
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {level}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Sidebar bottom — simple link to main site */}
        {!showCurriculum && !sidebarCollapsed && (
          <div className="border-t border-border shrink-0 p-3">
            <Link
              href={"/"}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ExternalLink className="size-3.5" />
              Main site
            </Link>
          </div>
        )}
      </aside>

      {/* Main content — single flow, sidebar offset applied via responsive margin */}
      <div className="flex flex-col h-dvh md:min-h-dvh">
        <main className={cn(
          "flex-1 overflow-y-auto",
          sidebarCollapsed ? "md:ml-16" : "md:ml-80"
        )}>
          {children}
        </main>
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
