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
  const [showAppCard, setShowAppCard] = useState(true);

  const handleTabChange = (tab: LearnTab) => {
    setActiveTab(tab);
    if (isMobile) {
      setOpenMobile(false);
    }
    if (pathname !== "/learn") {
      router.push("/learn");
    }
  };

  const navItems: { key: LearnTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: "home", label: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
    { key: "learn", label: "Modules", icon: <CheckCircle2 className="size-5" />, badge: "3" },
    { key: "alerts", label: "Alerts", icon: <Bell className="size-5" />, badge: "12+" },
    { key: "documents", label: "Documents", icon: <FileText className="size-5" /> },
  ];

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
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
              <SidebarGroupLabel className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton 
                        isActive={activeTab === item.key}
                        onClick={() => handleTabChange(item.key)}
                        tooltip={item.label}
                        className="py-5 rounded-xl transition-all"
                      >
                        {item.icon}
                        <span className="font-semibold text-[13px]">{item.label}</span>
                        {item.badge && !isCollapsed && (
                          <span className="ml-auto flex h-5 px-1.5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground shadow-sm">
                            {item.badge}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  {/* Profile & Settings inside Sidebar Menu instead of accordion */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "profile"}
                      onClick={() => handleTabChange("profile")}
                      tooltip="Profile"
                      className="py-5 rounded-xl transition-all"
                    >
                      <User className="size-5" />
                      <span className="font-semibold text-[13px]">Community Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Quick links & Settings group */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mt-4 mb-1">General</SidebarGroupLabel>
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
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="size-full rounded-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">
                      {user?.first_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isLoggedIn && (
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs" title="Level">
                    {level}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2 space-y-4">
                {/* Mobile App Callout Card */}
                {showAppCard && (
                  <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-5 shadow-sm">
                    <button
                      onClick={() => setShowAppCard(false)}
                      className="absolute top-2 right-2 size-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors z-20"
                    >
                      <X className="size-3.5" />
                    </button>
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
                      <svg className="size-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z"/></svg>
                    </div>
                    <div className="relative z-10 space-y-2">
                      <h4 className="font-black text-sm">Get the BNS App</h4>
                      <p className="text-[10px] text-white/80 font-medium">Follow budgets on the go and never miss a civic alert.</p>
                      <button className="mt-2 w-full rounded-xl bg-white text-primary text-xs font-bold py-2 shadow-sm hover:bg-white/90 transition-colors">
                        Download Now
                      </button>
                    </div>
                  </div>
                )}

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
          {/* Header with sidebar trigger - muted for now (change 'hidden' back to 'flex' to restore) */}
          <header className="hidden h-14 items-center gap-4 border-b border-border bg-background px-4 md:hidden">
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
