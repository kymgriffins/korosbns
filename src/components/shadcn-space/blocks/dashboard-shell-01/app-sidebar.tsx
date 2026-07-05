"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo/logo";
import { NavMain } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-main";
import {
  BarChart3,
  BookOpen,
  ChartPie,
  CircleUserRound,
  FileText,
  Languages,
  LucideIcon,
  MessagesSquare,
  Notebook,
  NotepadText,
  Ticket,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/shadcn-space/blocks/dashboard-shell-01/site-header";
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
  { title: "Dashboard", icon: BarChart3, href: "/learn", isActive: true },
  { title: "Modules", icon: BookOpen, href: "/learn?tab=modules" },
  { title: "Documents", icon: FileText, href: "/learn/documents" },
  { title: "Forum", icon: MessagesSquare, href: "/learn/forum" },
  { title: "Profile", icon: CircleUserRound, href: "/learn/profile" },

  { label: "Content", isSection: true },
  { title: "Videos", icon: Languages, href: "/learn/videos" },
  { title: "Articles", icon: NotepadText, href: "/learn/articles" },
  { title: "Stories", icon: Notebook, href: "/learn/stories" },
  { title: "Quests", icon: Ticket, href: "/learn/quests" },
  { title: "Analytics", icon: ChartPie, href: "/learn/analytics" },
];

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

const AppSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Sidebar className="py-4 px-0 bg-background">
        <div className="flex flex-col gap-6 bg-background">
          {/* ---------------- Header ---------------- */}
          <SidebarHeader className="py-0 px-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <a href="#" className="w-full h-full">
                  <Logo />
                </a>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          {/* ---------------- Content ---------------- */}
          <SidebarContent className="overflow-hidden gap-0 px-0">
            <SimpleBar
              autoHide={true}
              className="h-[calc(100vh-348px)] border-b border-border"
            >
              <div className="px-4">
                <NavMain items={navData} />
              </div>
            </SimpleBar>
            {/* subscription dialog */}
            <div className="pt-4 px-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="shadow-none ring-0 bg-primary/5 px-4 py-6 cursor-pointer hover:bg-primary/10 transition-colors">
                    <CardContent className="p-0 flex flex-col gap-3 items-center">
                      <div className="flex flex-col gap-3 items-center">
                        <div>
                          <p className="text-sm font-semibold text-card-foreground text-center">
                            Get budget updates in your inbox
                          </p>
                          <p className="text-xs text-muted-foreground text-center mt-1 max-w-48">
                            Subscribe for explainers, stories, and policy highlights from Budget Ndio Story.
                          </p>
                        </div>
                        <Button className="w-fit px-4 py-2 shadow-none cursor-pointer rounded-xl bg-primary font-medium hover:bg-primary/80 h-8 text-xs">
                          Subscribe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="md:max-w-4xl p-0 rounded-none">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Subscribe to Budget Ndio Story</DialogTitle>
                  </DialogHeader>
                  <div className="flex md:flex-row flex-col">
                    <div className="md:max-w-md w-full">
                      <img
                        src="/images/towwnhallmay/129A4056.jpg"
                        alt="Budget Ndio Story"
                        className="w-full object-cover sm:h-full h-40"
                      />
                    </div>
                    <div className="md:p-16 p-6 w-full">
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                          <h2 className="text-card-foreground text-3xl font-medium">
                            Get budget updates in your inbox
                          </h2>
                          <p className="text-muted-foreground text-base font-normal">
                            Subscribe for explainers, stories, and policy highlights from Budget Ndio Story.
                          </p>
                        </div>
                        <form className="flex flex-col gap-4">
                          <div className="flex flex-col gap-3">
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              required
                              className="dark:bg-background rounded-lg h-9 shadow-xs"
                            />
                            <Button
                              type="submit"
                              size="lg"
                              className="rounded-lg h-10 cursor-pointer hover:bg-primary/80"
                            >
                              Subscribe now
                            </Button>
                          </div>
                          <div className="flex items-center gap-3">
                            <Checkbox id="newsletter" className="cursor-pointer" />
                            <FieldLabel
                              htmlFor="newsletter"
                              className="text-sm text-muted-foreground font-normal cursor-pointer"
                            >
                              I agree to receive email updates
                            </FieldLabel>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </SidebarContent>
        </div>
      </Sidebar>

      {/* ---------------- Main ---------------- */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex items-center border-b px-6 py-3 bg-background">
          <SiteHeader />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default AppSidebar;
