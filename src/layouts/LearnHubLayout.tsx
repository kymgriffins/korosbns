"use client";

import Link from "next/link";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ChevronRight, X, EllipsisVertical,
  BookOpen, LayoutDashboard, ExternalLink,
  LogOut, LogIn, User, FileText,
  MessagesSquare, Calendar, ListChecks
} from "lucide-react";
import { cn } from "@/utils";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { LearnProvider, useLearn, type LearnTab } from "@/contexts/learn-context";
import { LearnTabSync } from "@/components/learn/learn-tab-sync";
import { learnTabToHref } from "@/lib/learn-nav";
import { useAuth } from "@/contexts/auth-context";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";
import { Routes } from "@/constants/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { SurveyListItemApi } from "@/lib/api-client";
import { loadEventList, type HubEvent } from "@/lib/citizen-content";
import { loadSurveyList } from "@/lib/marketing-content";

function isEmojiBadge(badge: string) {
  return /\p{Extended_Pictographic}/u.test(badge);
}

function ModuleNavBadge({ badge }: { badge?: string }) {
  if (!badge) return null;
  if (isEmojiBadge(badge)) {
    return <span className="shrink-0 text-sm leading-none">{badge}</span>;
  }
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[9px] font-bold uppercase tracking-wide text-primary">
      {badge}
    </span>
  );
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
} from "@/components/ui/sidebar";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
}

function LearnNavUser() {
  const { isLoggedIn, user, logout } = useAuth();
  const { gamification } = useLearn();
  const { isMobile } = useSidebar();
  const level = gamification?.level ?? 1;

  const displayName = user?.display_name || [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "User";
  const email = user?.email || "";
  const avatar = user?.avatar_url || user?.avatar || "";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={avatar || undefined} alt={displayName} />
                  <AvatarFallback className="rounded-lg">{getInitials(displayName)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-muted-foreground text-xs">Level {level}</span>
                </div>
                <EllipsisVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={avatar || undefined} alt={displayName} />
                    <AvatarFallback className="rounded-lg">{getInitials(displayName)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayName}</span>
                    <span className="truncate text-muted-foreground text-xs">Level {level}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={learnTabToHref("profile")}>
                  <User />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SidebarMenuButton asChild size="lg" tooltip="Sign In">
            <Link href={Routes.Login}>
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarFallback className="rounded-lg">?</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Sign In</span>
                <span className="truncate text-muted-foreground text-xs">Guest</span>
              </div>
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function LearnSidebar() {
  const { activeTab, setActiveTab, refreshGamification, activeLesson, civicModules } = useLearn();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
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
    <Sidebar variant="inset" collapsible="icon" className="hidden md:flex">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="BNS" width={28} height={28} className="size-7 shrink-0" />
                <span className="font-semibold text-base">Learning Hub</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className={cn("flex px-2", isCollapsed ? "justify-center" : "justify-end")}>
          <SidebarTrigger className="-mr-1" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
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
                            onClick={() => handleTabChange(item.key)}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                            {item.badge && !isCollapsed && (
                              <span className="ml-auto flex h-4.5 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs ring-1 ring-primary/20">{item.badge}</span>
                            )}
                            {!isCollapsed && <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
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
                                    href={`/learn/modules/${m.slug}`}
                                    onClick={() => { if (isMobile) setOpenMobile(false); }}
                                    className="flex min-w-0 items-center gap-2"
                                  >
                                    <ModuleNavBadge badge={m.badge} />
                                    <span className="truncate">{m.title}</span>
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
                    >
                      <Link href={learnTabToHref(item.key)} onClick={() => handleTabChange(item.key)}>
                        {item.icon}
                        <span>{item.label}</span>
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
        <SidebarMenu>
          <SidebarMenuItem>
            {showAppCard && !feedLoading && (
              <div className={cn("px-2 pb-1", isCollapsed && "hidden")}>
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
              </div>
            )}
            {showAppCard && feedLoading && (
              <div className={cn("px-2 pb-1", isCollapsed && "hidden")}>
                <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 animate-pulse">
                  <div className="size-8 rounded-full bg-muted-foreground/10" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 w-24 rounded bg-muted-foreground/10" />
                    <div className="h-2 w-32 rounded bg-muted-foreground/10" />
                  </div>
                </div>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
        <LearnNavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

function LearnAppShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const onScroll = () => setScrolled(main.scrollTop > 10);
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

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
            <Link href="/" className="flex items-center gap-2 min-w-0">
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
            </div>
          </header>
          <main className="flex-1 overflow-y-auto pb-mobile-nav lg:pb-0">{children}</main>
          <LearnMobileNav />
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
