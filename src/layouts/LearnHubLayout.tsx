"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  ChevronRight, ChevronLeft, ChevronDown, X,
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
  const { activeTab, setActiveTab, gamification, activeLesson, civicModules } = useLearn();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const level = gamification?.level ?? 1;
  const [showAppCard, setShowAppCard] = useState(true);

  const handleTabChange = (tab: LearnTab) => {
    setActiveTab(tab);
    if (isMobile) setOpenMobile(false);
    if (pathname !== "/learn") router.push("/learn");
  };

  const moduleCount = civicModules.length;
  const alertCount = 0;

  const navItems: { key: LearnTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: "home", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
    { key: "learn", label: "Modules", icon: <CheckCircle2 className="size-4" />, badge: moduleCount > 0 ? String(moduleCount) : undefined },
    { key: "alerts", label: "Alerts", icon: <Bell className="size-4" />, badge: alertCount > 0 ? String(alertCount) : undefined },
    { key: "documents", label: "Documents", icon: <FileText className="size-4" /> },
  ];

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <Link href={"/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity overflow-hidden">
            <img src="/logo.svg" alt="BNS" className="h-7 w-auto shrink-0" />
          </Link>
          {!isCollapsed && <SidebarTrigger className="-mr-1" />}
        </div>
        {isCollapsed && <div className="flex justify-center mt-1"><SidebarTrigger /></div>}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-0.5">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton isActive={activeTab === item.key} onClick={() => handleTabChange(item.key)} tooltip={item.label} className="py-4 rounded-lg transition-all">
                    {item.icon}
                    <span className="font-semibold text-xs">{item.label}</span>
                    {item.badge && !isCollapsed && (
                      <span className="ml-auto flex h-4.5 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs">{item.badge}</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "profile"} onClick={() => handleTabChange("profile")} tooltip="Profile" className="py-4 rounded-lg transition-all">
                  <User className="size-4" />
                  <span className="font-semibold text-xs">Community Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mt-3 mb-0.5">General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoggedIn ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Account">
                      <Link href={Routes.Account}><Settings className="size-4" /><span>Account Settings</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Password">
                      <Link href={Routes.AccountPassword}><KeyRound className="size-4" /><span>Change Password</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Sign Out">
                      <Link href={Routes.AccountSignOut}><LogOut className="size-4" /><span>Sign Out</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Sign In" className="text-primary hover:text-primary">
                    <Link href={Routes.Login}><LogIn className="size-4" /><span>Sign In</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <div className="flex items-center gap-3 px-2 py-1.5 text-xs font-medium text-muted-foreground w-full group-data-[collapsible=icon]:justify-center">
                  <Palette className="size-4 shrink-0" />
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
          <div className="flex flex-col items-center gap-2 py-2">
            <Avatar className="size-7">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="size-full rounded-full object-cover" />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                  {user?.first_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              )}
            </Avatar>
            {isLoggedIn && (
              <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]" title="Level">{level}</div>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-3">
            {showAppCard && (
              <div className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-4 shadow-xs">
                <button onClick={() => setShowAppCard(false)}
                  className="absolute top-1.5 right-1.5 size-5 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors z-20">
                  <X className="size-3" />
                </button>
                <div className="relative z-10 space-y-1.5">
                  <h4 className="font-bold text-xs">Get the BNS App</h4>
                  <p className="text-[10px] text-white/80">Follow budgets on the go.</p>
                  <button className="mt-1.5 w-full rounded-lg bg-white text-primary text-[11px] font-bold py-1.5 shadow-xs hover:bg-white/90 transition-colors">Download</button>
                </div>
              </div>
            )}

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Main Site">
                  <Link href="/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    <span>Main site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function LearnAppShell({ children }: { children: React.ReactNode }) {
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkProfile = () => {
      try {
        const raw = localStorage.getItem("bns_user_profile");
        setHasProfile(!!raw && JSON.parse(raw)?.breakName);
      } catch {
        setHasProfile(false);
      }
    };
    checkProfile();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "bns_user_profile") checkProfile();
    };
    const onProfileUpdate = () => checkProfile();
    window.addEventListener("storage", onStorage);
    window.addEventListener("bns-profile-updated", onProfileUpdate);

    const isMobileDevice = () => window.innerWidth < 768;
    const lockBody = () => {
      if (isMobileDevice()) document.body.classList.add("overflow-hidden");
      else document.body.classList.remove("overflow-hidden");
    };
    lockBody();
    window.addEventListener("resize", lockBody);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("resize", lockBody);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("bns-profile-updated", onProfileUpdate);
    };
  }, []);

  if (!hasProfile) {
    return (
      <div className="min-h-dvh bg-background text-foreground overflow-hidden flex items-center justify-center">
        <main className="w-full">{children}</main>
      </div>
    );
  }

  return (
    <div className="h-dvh md:min-h-screen bg-background text-foreground overflow-hidden">
      <SidebarProvider>
        <LearnSidebar />
        <div className="flex flex-col flex-1 h-dvh md:min-h-dvh min-w-0 overflow-hidden">
          <header className="flex h-12 items-center gap-4 border-b border-border/30 bg-background px-4 md:hidden">
            <SidebarTrigger className="-ml-1" />
            <div className="font-semibold text-sm">Learning Hub</div>
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
          <div className="md:hidden"><LearnMobileNav /></div>
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
          <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }>
        <LearnAppShell>{children}</LearnAppShell>
      </Suspense>
    </LearnProvider>
  );
}
