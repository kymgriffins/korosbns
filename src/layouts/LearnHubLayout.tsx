"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { 
  ChevronRight, ChevronLeft, ChevronDown,
  BookOpen, Bell, Home, LayoutDashboard, CheckCircle2, ArrowLeft, ExternalLink,
  Settings, LogOut, KeyRound, Palette, LogIn, User, FileText
} from "lucide-react";
import { cn } from "@/utils";
import { LearnProvider, useLearn, type LearnTab } from "@/contexts/learn-context";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";
import { Routes } from "@/constants/routes";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/ui/sidebar";

function LearnSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const {
    activeTab,
    setActiveTab,
    gamification,
    activeLesson,
    civicModules,
  } = useLearn();
  
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const level = gamification?.level ?? 1;

  const handleTabChange = (tab: LearnTab) => {
    setActiveTab(tab);
    if (isMobile) {
      setOpenMobile(false);
    }
    if (pathname !== "/learn") {
      router.push("/learn");
    }
  };

  const navItems: { key: LearnTab; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
    { key: "learn", label: "Learn", icon: <BookOpen className="size-5" /> },
    { key: "alerts", label: "Alerts", icon: <Bell className="size-5" /> },
    { key: "documents", label: "Documents", icon: <FileText className="size-5" /> },
  ];

  /* If an active lesson is set, we'll render a curriculum rail */
  const showCurriculum = !!activeLesson;

  return (
    <Sidebar collapsible="icon">
      {showCurriculum ? (
        <>
          <SidebarHeader>
            <div className="p-2 border-b border-border flex items-center justify-between">
              <SidebarMenuButton
                onClick={() => {
                  /* Clear active lesson — handled by learn-paths-home through onClose */
                }}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-4" />
                {!isCollapsed && <span>Back to Dashboard</span>}
              </SidebarMenuButton>
              {!isCollapsed && <SidebarTrigger className="-mr-1" />}
            </div>
            {isCollapsed && (
              <div className="flex justify-center mt-2">
                 <SidebarTrigger />
              </div>
            )}
            {!isCollapsed && (
              <div className="p-2 border-b border-border bg-primary/5 rounded-md mt-2 mx-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{activeLesson.stageBadge}</span>
                  <h3 className="text-xs font-black uppercase leading-tight">{activeLesson.stageTitle}</h3>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {activeLesson.completedStepIds.length} / {activeLesson.totalSteps} steps completed
                </p>
              </div>
            )}
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {activeLesson.stepTitles.map((step, i) => {
                    const stepNum = i + 1;
                    const isComplete = activeLesson.completedStepIds.includes(step.id);
                    const isActive = activeLesson.currentStep === stepNum;
                    return (
                      <SidebarMenuItem key={step.id}>
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={step.title}
                          className={cn(
                            "h-auto py-2",
                            isActive && "bg-primary/10 text-primary font-bold",
                            isComplete && !isActive && "text-muted-foreground/60"
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
                          <span>{step.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>All Modules ({civicModules.length})</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {civicModules.map((mod) => {
                    const isCurrent = mod.slug === activeLesson.stageId;
                    return (
                      <SidebarMenuItem key={mod.slug}>
                        <SidebarMenuButton isActive={isCurrent} tooltip={mod.title}>
                          <span className="text-sm">{mod.badge}</span>
                          <span className="truncate text-[11px]">{mod.title}</span>
                          {isCurrent && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </>
      ) : (
        <>
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
              <Link href={"/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity overflow-hidden">
                <img src="/logo.svg" alt="Budget Ndio Story" className="h-8 w-auto shrink-0" />
              </Link>
              {!isCollapsed && <SidebarTrigger className="-mr-1" />}
            </div>
            {isCollapsed && (
              <div className="flex justify-center mt-2">
                 <SidebarTrigger />
              </div>
            )}
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton 
                        isActive={activeTab === item.key}
                        onClick={() => handleTabChange(item.key)}
                        tooltip={item.label}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  {/* Profile & Settings inside Sidebar Menu instead of accordion */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "profile"}
                      onClick={() => handleTabChange("profile")}
                      tooltip="Profile"
                    >
                      <User className="size-5" />
                      <span>Learner Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Quick links & Settings group */}
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {isLoggedIn ? (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Account Settings">
                          <Link href={Routes.Account}>
                            <Settings className="size-5" />
                            <span>Account Settings</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Change Password">
                          <Link href={Routes.AccountPassword}>
                            <KeyRound className="size-5" />
                            <span>Change Password</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Sign Out">
                          <Link href={Routes.AccountSignOut}>
                            <LogOut className="size-5" />
                            <span>Sign Out</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Sign In" className="text-primary hover:text-primary">
                        <Link href={Routes.Login}>
                          <LogIn className="size-5" />
                          <span>Sign In</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  <SidebarMenuItem>
                    <div className="flex items-center gap-3 px-2 py-1.5 text-sm font-medium text-muted-foreground w-full group-data-[collapsible=icon]:justify-center">
                      <Palette className="size-5 shrink-0" />
                      {!isCollapsed && <span className="flex-1 text-left">Theme</span>}
                      {!isCollapsed && <ThemeToggle />}
                    </div>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-3 py-2">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">
                    {user?.first_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                {isLoggedIn && (
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs" title="Level">
                    {level}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Main Site">
                      <Link href="/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-5" />
                        <span>Main site</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            )}
          </SidebarFooter>
        </>
      )}
    </Sidebar>
  );
}

function LearnAppShell({ children }: { children: React.ReactNode }) {
  // Mobile body lock handling
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

  return (
    <div className="h-dvh md:min-h-screen bg-background text-foreground overflow-hidden">
      <SidebarProvider>
        <LearnSidebar />
        
        {/* Main content */}
        <div className="flex flex-col flex-1 h-dvh md:min-h-dvh min-w-0 overflow-hidden">
          {/* Header with sidebar trigger - only shown when needed or can float over content */}
          <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-4 md:hidden">
            <SidebarTrigger className="-ml-1" />
            <div className="font-semibold">Learning Hub</div>
          </header>
          
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          
          <div className="md:hidden">
            <LearnMobileNav />
          </div>
        </div>
      </SidebarProvider>
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
