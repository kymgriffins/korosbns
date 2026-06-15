"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ChevronRight, ChevronLeft, ChevronDown, X,
  BookOpen, Bell, Home, LayoutDashboard, CheckCircle2, ArrowLeft, ExternalLink,
  Settings, LogOut, KeyRound, Palette, LogIn, User, FileText,
  MessagesSquare, HelpCircle, Calendar, ListChecks
} from "lucide-react";
import { cn } from "@/utils";
import { LearnProvider, useLearn, type LearnTab } from "@/contexts/learn-context";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";
import { Routes } from "@/constants/routes";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import type { SurveyListItemApi } from "@/lib/api-client";
import { loadEventList, type HubEvent } from "@/lib/citizen-content";
import { loadSurveyList } from "@/lib/marketing-content";
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
  const { isLoggedIn, loading: userLoading, user } = useAuth();
  const { activeTab, setActiveTab, gamification, refreshGamification, activeLesson, civicModules } = useLearn();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const level = gamification?.level ?? 1;
  const noUserYet = userLoading && !user;
  const [showAppCard, setShowAppCard] = useState(true);
  const [events, setEvents] = useState<HubEvent[]>([]);
  const [surveys, setSurveys] = useState<SurveyListItemApi[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);

  const upcomingEvents = useMemo(() =>
    events.filter((ev) => ev.starts_at && new Date(ev.starts_at) >= new Date(new Date().toDateString())),
    [events]
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [eventList, surveyList] = await Promise.all([
          loadEventList().catch(() => [] as HubEvent[]),
          loadSurveyList().catch(() => [] as SurveyListItemApi[]),
        ]);
        if (cancelled) return;
        setEvents(eventList);
        setSurveys(surveyList);
      } finally {
        if (!cancelled) setFeedLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Re-fetch user profile and gamification when profile updates in-app
  const queryClient = useQueryClient();
  useEffect(() => {
    const onProfileUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      void refreshGamification();
    };
    window.addEventListener("bns-profile-updated", onProfileUpdate);
    return () => window.removeEventListener("bns-profile-updated", onProfileUpdate);
  }, [queryClient, refreshGamification]);

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
          <Link href={"/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity overflow-hidden group">
            <img src="/logo.svg" alt="BNS" className="h-7 w-auto shrink-0" />
          </Link>
          {!isCollapsed && <SidebarTrigger className="-mr-1" />}
        </div>
        {isCollapsed && <div className="flex justify-center mt-1"><SidebarTrigger /></div>}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold tracking-wider text-sidebar-foreground/50 uppercase mb-0.5">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeTab === item.key}
                    onClick={() => handleTabChange(item.key)}
                    tooltip={item.label}
                    className="py-4 rounded-lg transition-all data-[active=true]:ring-1 data-[active=true]:ring-sidebar-ring/30"
                  >
                    {item.icon}
                    <span className="font-semibold text-xs">{item.label}</span>
                    {item.badge && !isCollapsed && (
                      <span className="ml-auto flex h-4.5 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs ring-1 ring-primary/20">{item.badge}</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "profile"}
                  onClick={() => handleTabChange("profile")}
                  tooltip="Profile"
                  className="py-4 rounded-lg transition-all data-[active=true]:ring-1 data-[active=true]:ring-sidebar-ring/30"
                >
                  <User className="size-4" />
                  <span className="font-semibold text-xs">Community Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "forum"}
                  onClick={() => handleTabChange("forum")}
                  tooltip="Forums"
                  className="py-4 rounded-lg transition-all data-[active=true]:ring-1 data-[active=true]:ring-sidebar-ring/30"
                >
                  <MessagesSquare className="size-4" />
                  <span className="font-semibold text-xs">Forums</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold tracking-wider text-sidebar-foreground/50 uppercase mt-3 mb-0.5">General</SidebarGroupLabel>
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
                <SidebarMenuButton asChild tooltip="Help Center" className="focus-visible:ring-2 focus-visible:ring-ring">
                  <Link href="/help"><HelpCircle className="size-4" /><span>Help Center</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
            {noUserYet ? (
              <div className="flex flex-col items-center gap-2">
                <div className="size-7 rounded-full bg-muted animate-pulse" />
                <div className="size-7 rounded-full bg-muted animate-pulse" />
              </div>
            ) : (
              <>
                <Avatar className="size-7 ring-1 ring-sidebar-border/40">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="size-full rounded-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                      {user?.first_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isLoggedIn && (
                  <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] ring-1 ring-primary/20" title="Level">{level}</div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-3">
            {showAppCard && !feedLoading && (
              <Link
                href={upcomingEvents.length > 0 ? Routes.Events : Routes.Surveys}
                className="relative block overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-500/90 to-teal-600 text-white p-4 shadow-xs group"
              >
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.07] mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAppCard(false); }}
                  className="absolute top-1.5 right-1.5 size-5 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors z-20 focus-visible:ring-2 focus-visible:ring-white/50">
                  <X className="size-3" />
                </button>
                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    {upcomingEvents.length > 0 ? <Calendar className="size-4" /> : <ListChecks className="size-4" />}
                    <h4 className="font-bold text-xs">{upcomingEvents.length > 0 ? "Upcoming Events" : "Active Surveys"}</h4>
                  </div>
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 2).map((ev) => (
                      <div key={ev.id} className="space-y-0.5">
                        <p className="text-[10px] text-white/80">{ev.title}</p>
                        <p className="text-[9px] text-white/60">{ev.location} · {new Date(ev.starts_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                    ))
                  ) : surveys.length > 0 ? (
                    surveys.slice(0, 2).map((sv) => (
                      <div key={sv.id} className="space-y-0.5">
                        <p className="text-[10px] text-white/80">{sv.title}</p>
                        {sv.description && <p className="text-[9px] text-white/60 line-clamp-1">{sv.description}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-white/60">No upcoming content yet.</p>
                  )}
                </div>
              </Link>
            )}
            {showAppCard && feedLoading && (
              <div className="rounded-xl bg-muted/50 p-4 animate-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-4 rounded bg-muted-foreground/20" />
                  <div className="h-3 w-24 rounded bg-muted-foreground/20" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted-foreground/20" />
                  <div className="h-2 w-2/3 rounded bg-muted-foreground/20" />
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
  const { isLoggedIn } = useAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("bns-profile-updated", onProfileUpdate);
    };
  }, []);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const onScroll = () => setScrolled(main.scrollTop > 10);
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  if (!isLoggedIn && !hasProfile) {
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
          <header
            className={`flex h-12 items-center gap-4 border-b px-4 md:hidden sticky top-0 z-20 transition-all duration-200 ${
              scrolled
                ? "bg-background/80 backdrop-blur-lg shadow-xs border-border/50"
                : "bg-background border-border/30"
            }`}
          >
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
