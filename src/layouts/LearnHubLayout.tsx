"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ChevronDown, ChevronRight, X,
  BookOpen, LayoutDashboard, ArrowLeft, ExternalLink,
  LogOut, Palette, LogIn, User, FileText, Settings,
  MessagesSquare, Calendar, ListChecks
} from "lucide-react";
import { cn } from "@/utils";
import { LearnProvider, useLearn, type LearnTab } from "@/contexts/learn-context";
import { LearnTabSync } from "@/components/learn/learn-tab-sync";
import { learnTabToHref } from "@/lib/learn-nav";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";
import { Routes } from "@/constants/routes";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import type { SurveyListItemApi } from "@/lib/api-client";
import { loadEventList, type HubEvent } from "@/lib/citizen-content";
import { loadSurveyList } from "@/lib/marketing-content";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/ui/collapsible";
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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/ui/sidebar";

function UserPopover({
  isLoggedIn, user, level, handleTabChange, children,
}: {
  isLoggedIn: boolean;
  user: any;
  level: number;
  handleTabChange: (tab: LearnTab) => void;
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent align="end" side="top" className="w-56 rounded-xl border-border/60 p-2 shadow-lg ring-1 ring-border/40">
        <div className="space-y-1">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-3 px-2 py-2 border-b border-border/30 mb-1">
                <Avatar className="size-8 ring-1 ring-sidebar-border/40 shrink-0">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="size-full rounded-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {user?.first_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{user?.display_name || user?.first_name || "User"}</p>
                  <p className="truncate text-[10px] text-muted-foreground">Level {level}</p>
                </div>
              </div>
              <PopoverItem href={learnTabToHref("profile")} onClick={() => handleTabChange("profile")}>
                <User className="size-3.5" /> View Profile
              </PopoverItem>
              <PopoverItem href={Routes.Account}>
                <Settings className="size-3.5" /> Account Settings
              </PopoverItem>
              <div className="flex items-center gap-3 px-2 py-1.5 text-xs font-medium text-muted-foreground rounded-lg hover:bg-sidebar-accent transition-colors">
                <Palette className="size-3.5 shrink-0" />
                <span className="flex-1">Theme</span>
                <ThemeToggle />
              </div>
              <div className="border-t border-border/30 pt-1 mt-1">
                <PopoverItem href={Routes.AccountSignOut}>
                  <LogOut className="size-3.5" /> Sign Out
                </PopoverItem>
              </div>
            </>
          ) : (
            <PopoverItem href={Routes.Login}>
              <LogIn className="size-3.5" /> Sign In
            </PopoverItem>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function PopoverItem({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </Link>
  );
}

function LearnSidebar() {
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
  };

  const moduleCount = civicModules.length;

  const primaryItems: { key: LearnTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: "home", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
    { key: "learn", label: "Modules", icon: <BookOpen className="size-4" />, badge: moduleCount > 0 ? String(moduleCount) : undefined },
    { key: "documents", label: "Documents", icon: <FileText className="size-4" /> },
    { key: "profile", label: "Profile", icon: <User className="size-4" /> },
    { key: "forum", label: "Forums", icon: <MessagesSquare className="size-4" /> },
  ];

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <Link href={"/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity overflow-hidden group">
            <img src="/logo.svg" alt="BNS" className="h-7 w-auto shrink-0" width={108} height={28} />
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
              {primaryItems.map((item) => {
                if (item.key === "learn") {
                  return (
                    <Collapsible key={item.key} defaultOpen className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={activeTab === item.key}
                            tooltip={item.label}
                            className="py-4 rounded-lg transition-all data-[active=true]:ring-1 data-[active=true]:ring-sidebar-ring/30"
                            onClick={() => handleTabChange(item.key)}
                          >
                            {item.icon}
                            <span className="font-semibold text-xs">{item.label}</span>
                            {item.badge && !isCollapsed && (
                              <span className="ml-auto flex h-4.5 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs ring-1 ring-primary/20">{item.badge}</span>
                            )}
                            {!isCollapsed && <ChevronDown className="ml-auto size-3 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {civicModules.map((m) => (
                              <SidebarMenuSubItem key={m.id}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={activeLesson?.stageId === m.slug}
                                >
                                  <Link
                                    href={`${Routes.Learn}?tab=modules`}
                                    onClick={() => { if (isMobile) setOpenMobile(false); }}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="text-sm leading-none">{m.badge}</span>
                                    <span className="truncate text-xs font-medium">{m.badgeName || m.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeTab === item.key}
                      tooltip={item.label}
                      className="py-4 rounded-lg transition-all data-[active=true]:ring-1 data-[active=true]:ring-sidebar-ring/30"
                    >
                      <Link href={learnTabToHref(item.key)} onClick={() => handleTabChange(item.key)}>
                        {item.icon}
                        <span className="font-semibold text-xs">{item.label}</span>
                        {item.badge && !isCollapsed && (
                          <span className="ml-auto flex h-4.5 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs ring-1 ring-primary/20">{item.badge}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
              <UserPopover isLoggedIn={isLoggedIn} user={user} level={level} handleTabChange={handleTabChange}>
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="size-7 ring-1 ring-sidebar-border/40 cursor-pointer">
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
                </div>
              </UserPopover>
            )}
            <Link
              href="/"
              aria-label="Back to main site"
              title="Back to main site"
              className="mt-1 inline-flex size-7 items-center justify-center rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="p-2 space-y-1.5">
            {!noUserYet && (
              <UserPopover isLoggedIn={isLoggedIn} user={user} level={level} handleTabChange={handleTabChange}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Avatar className="size-8 ring-1 ring-sidebar-border/40 shrink-0">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="size-full rounded-full object-cover" />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                        {user?.first_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold">{user?.display_name || user?.first_name || "User"}</p>
                    <p className="truncate text-[10px] text-muted-foreground">Level {level}</p>
                  </div>
                  <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                </button>
              </UserPopover>
            )}
            {showAppCard && !feedLoading && (
              <Link
                href={upcomingEvents.length > 0 ? Routes.Events : Routes.Surveys}
                className="relative flex items-start gap-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-3 text-sm ring-1 ring-emerald-500/20 hover:from-emerald-500/15 hover:to-teal-500/15 transition-all group"
              >
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAppCard(false); }}
                  className="absolute top-1.5 right-1.5 size-4 rounded-full bg-muted-foreground/10 flex items-center justify-center hover:bg-muted-foreground/20 transition-colors z-10">
                  <X className="size-2.5" />
                </button>
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  {upcomingEvents.length > 0 ? <Calendar className="size-4" /> : <ListChecks className="size-4" />}
                </div>
                <div className="min-w-0 flex-1 pr-4">
                  <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    {upcomingEvents.length > 0 ? "Upcoming Events" : "Active Surveys"}
                  </p>
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 2).map((ev) => (
                      <p key={ev.id} className="text-[10px] text-muted-foreground truncate">{ev.title}</p>
                    ))
                  ) : surveys.length > 0 ? (
                    surveys.slice(0, 2).map((sv) => (
                      <p key={sv.id} className="text-[10px] text-muted-foreground truncate">{sv.title}</p>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted-foreground">No upcoming content</p>
                  )}
                </div>
              </Link>
            )}
            {showAppCard && feedLoading && (
              <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 animate-pulse">
                <div className="size-8 rounded-full bg-muted-foreground/10" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-24 rounded bg-muted-foreground/10" />
                  <div className="h-2 w-32 rounded bg-muted-foreground/10" />
                </div>
              </div>
            )}

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to main site">
                  <Link href="/">
                    <ArrowLeft className="size-4" />
                    <span>Back to main site</span>
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
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { civicModules } = useLearn();
  const [hasProfile, setHasProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const canBrowseModules = civicModules.length > 0;

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

  // Don't collapse to bare fallback while auth is still resolving — sidebar
  // should always render (its noUserYet skeleton handles the loading state).
  if (!authLoading && !isLoggedIn && !hasProfile && !canBrowseModules) {
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
            className={`flex h-12 items-center justify-between gap-2 border-b px-3 md:hidden sticky top-0 z-20 transition-all duration-200 ${
              scrolled
                ? "bg-background/80 backdrop-blur-lg shadow-xs border-border/50"
                : "bg-background border-border/30"
            }`}
          >
            <Link href="/learn" className="flex items-center gap-2 min-w-0">
              <img src="/logo.svg" alt="BNS" className="h-6 w-auto shrink-0" />
            </Link>
            <div className="flex items-center gap-1">
              <a
                href="/learn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Learning Hub in a new tab"
                className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ExternalLink className="size-4" />
              </a>
              <ThemeToggle />
              <Link
                href="/"
                aria-label="Back to main site"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 text-xs font-bold text-primary ring-1 ring-primary/20 transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowLeft className="size-3.5" />
                Main site
              </Link>
            </div>
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
        <LearnTabSync />
        <LearnAppShell>{children}</LearnAppShell>
      </Suspense>
    </LearnProvider>
  );
}
