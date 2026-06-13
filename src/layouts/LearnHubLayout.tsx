"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  Bell, LayoutDashboard, CheckCircle2, ExternalLink,
  Settings, LogOut, KeyRound, Palette, LogIn, User, FileText,
  MessagesSquare,
} from "lucide-react";
import { LearnProvider, useLearn, type LearnTab } from "@/contexts/learn-context";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";
import { Routes } from "@/constants/routes";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Separator } from "@/ui/separator";
import { loadEventList, type HubEvent } from "@/lib/citizen-content";
import { loadSurveyList } from "@/lib/marketing-content";
import { LearnSidebarPromoCard } from "@/components/learn/learn-sidebar-promo-card";
import { Skeleton } from "@/ui/skeleton";
import type { SurveyListItemApi } from "@/lib/api-client";
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
            <img src="/logo.svg" alt="BNS logo" className="h-7 w-auto shrink-0" />
          </Link>
          {!isCollapsed && <SidebarTrigger className="-mr-1" />}
        </div>
        {isCollapsed && <div className="flex justify-center mt-1"><SidebarTrigger /></div>}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
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
                    {item.badge && !isCollapsed && (
                      <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0">{item.badge}</Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "profile"}
                  onClick={() => handleTabChange("profile")}
                  tooltip="Community Profile"
                >
                  <User className="size-4" />
                  <span>Community Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "forum"}
                  onClick={() => handleTabChange("forum")}
                  tooltip="Forums"
                >
                  <MessagesSquare className="size-4" />
                  <span>Forums</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoggedIn ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Account Settings">
                      <Link href={Routes.Account}><Settings className="size-4" /><span>Account Settings</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Change Password">
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
                  <Palette className="size-4 shrink-0" aria-hidden />
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
            <Avatar className="size-7 ring-1 ring-sidebar-border/40">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="size-full rounded-full object-cover" />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {user?.first_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              )}
            </Avatar>
            {isLoggedIn && (
              <Badge variant="secondary" className="text-xs px-1.5" title="Level">{level}</Badge>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-3">
            {showAppCard && (
              feedLoading ? (
                <div className="rounded-xl p-4 space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-2 w-2/3" />
                </div>
              ) : (
                <LearnSidebarPromoCard
                  events={upcomingEvents}
                  surveys={surveys}
                  loading={false}
                  eventsHref={Routes.Events}
                  surveysHref={Routes.Surveys}
                  onDismiss={() => setShowAppCard(false)}
                />
              )
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
            className={`flex h-16 items-center gap-3 border-b px-4 md:hidden sticky top-0 z-20 transition-all duration-200 ${
              scrolled
                ? "bg-background/80 backdrop-blur-lg shadow-sm border-border/50"
                : "bg-background border-border/30"
            }`}
          >
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6" />
            <div className="font-semibold text-sm">Learning Hub</div>
          </header>
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
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
