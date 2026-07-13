"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-main";
import {
  BarChart3,
  BookOpen,
  CircleUserRound,
  FileText,
  Languages,
  LucideIcon,
  MessagesSquare,
  Notebook,
  NotepadText,
  Ticket,
} from "lucide-react";
import { SiteHeader } from "@/components/shadcn-space/blocks/dashboard-shell-01/site-header";
import { learnTabToHref } from "@/lib/learn-nav";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export type NavItem = {
  label?: string;
  isSection?: boolean;
  title?: string;
  icon?: LucideIcon;
  href?: string;
  children?: NavItem[];
  isActive?: boolean;
};

export const navData: NavItem[] = [
  { label: "Learning Hub", isSection: true },
  { title: "Dashboard", icon: BarChart3, href: learnTabToHref("home") },
  { title: "Modules", icon: BookOpen, href: learnTabToHref("learn") },
  { title: "Documents", icon: FileText, href: learnTabToHref("documents") },
  { title: "Forum", icon: MessagesSquare, href: learnTabToHref("forum") },
  { title: "Profile", icon: CircleUserRound, href: learnTabToHref("profile") },

  { label: "Content", isSection: true },
  { title: "Videos", icon: Languages, href: "/learn/videos" },
  { title: "Articles", icon: NotepadText, href: "/learn/articles" },
  { title: "Stories", icon: Notebook, href: "/learn/stories" },
  { title: "Quests", icon: Ticket, href: "/learn/quests" },
];

const AppSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider className="h-dvh overflow-hidden">
      <Sidebar className="py-4 px-0 bg-background">
        <div className="flex flex-col gap-6 bg-background">
          <SidebarHeader className="py-0 px-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/learn" className="flex items-center gap-2 w-full h-full py-1">
                  <Image
                    src="/logo.svg"
                    alt="Budget Ndio Story"
                    width={140}
                    height={36}
                    className="h-8 w-auto"
                    priority
                  />
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent className="overflow-hidden gap-0 px-0">
            <SimpleBar autoHide className="h-[calc(100dvh-5.5rem)]">
              <div className="px-4 pb-4">
                <NavMain items={navData} />
              </div>
            </SimpleBar>
          </SidebarContent>
        </div>
      </Sidebar>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-50 hidden shrink-0 items-center border-b bg-background px-6 py-3 lg:flex">
          <SiteHeader />
        </header>
        {/* Single scrollport for all /learn (+ /learnhub) content */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppSidebar;
