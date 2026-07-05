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
  AlignStartVertical,
  CreditCard,
  LayoutPanelTop,
  ChartPie,
  BarChart3,
  CircleUserRound,
  ClipboardList,
  Languages,
  LucideIcon,
  Notebook,
  NotepadText,
  Table,
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
  // Dashboards Section
  { label: "Dashboards", isSection: true },
  { title: "Analytics", icon: BarChart3, href: "#", isActive: true },
  { title: "CRM Dashboard", icon: ClipboardList, href: "#" },

  // Pages Section
  { label: "Pages", isSection: true },
  { title: "Tables", icon: Table, href: "#" },
  { title: "Forms", icon: ClipboardList, href: "#" },
  { title: "User Profile", icon: CircleUserRound, href: "#" },

  // Apps Section
  { label: "Apps", isSection: true },
  { title: "Notes", icon: Notebook, href: "#" },
  { title: "Tickets", icon: Ticket, href: "#" },
  {
    title: "Blogs",
    icon: Languages,
    children: [
      { title: "Blog Post", href: "#" },
      { title: "Blog Detail", href: "#" },
      { title: "Blog Edit", href: "#" },
      { title: "Blog Create", href: "#" },
      { title: "Manage Blogs", href: "#" },
    ],
  },

  // Form Elements Section
  { label: "Form Elements", isSection: true },
  {
    title: "Shadcn Forms",
    icon: NotepadText,
    children: [
      { title: "Button", href: "#" },
      { title: "Input", href: "#" },
      { title: "Select", href: "#" },
      { title: "Checkbox", href: "#" },
      { title: "Radio", href: "#" },
    ],
  },
  {
    title: "Form layouts",
    icon: AlignStartVertical,
    children: [
      { title: "Forms Horizontal", href: "#" },
      { title: "Forms Vertical", href: "#" },
      { title: "Forms Validation", href: "#" },
      { title: "Forms Examples", href: "#" },
      { title: "Forms Wizard", href: "#" },
    ],
  },
  { label: "WIDGETS", isSection: true },
  {
    title: "Cards",
    icon: CreditCard,
    children: [
      { title: "Ecommerce Actions", href: "#" },
      { title: "Course ", href: "#" },
      { title: "Campaign Performance ", href: "#" },
      { title: "Selling Products ", href: "#" },
      { title: "Activity Timeline ", href: "#" },
    ],
  },
  {
    title: "Banners",
    icon: LayoutPanelTop,
    children: [{ title: "Analytic Banner ", href: "#" }],
  },
  {
    title: "Charts",
    icon: ChartPie,
    children: [
      { title: "Sales Report", href: "#" },
      { title: "Weekly Sales", href: "#" },
    ],
  },
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
                  <Card className="shadow-none ring-0 bg-blue-500/10 px-4 py-6 cursor-pointer hover:bg-blue-500/20 transition-colors">
                    <CardContent className="p-0 flex flex-col gap-3 items-center">
                      <img
                        src="https://images.shadcnspace.com/assets/backgrounds/download-img.png"
                        alt="sidebar-img"
                        width={74}
                        height={74}
                        className="h-20 w-20"
                      />
                      <div className="flex flex-col gap-4 items-center">
                        <div>
                          <p className="text-base font-semibold text-card-foreground text-center">
                            Grab Pro Now
                          </p>
                          <p className="text-sm font-regular text-muted-foreground text-center">
                            Customize your admin
                          </p>
                        </div>
                        <Button className="w-fit px-4 py-2 shadow-none cursor-pointer rounded-xl bg-blue-500 font-medium hover:bg-blue-500/80 h-9">
                          Get Premium
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="md:max-w-4xl p-0 rounded-none">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Subscribe to Newsletter</DialogTitle>
                  </DialogHeader>
                  <div className="flex md:flex-row flex-col">
                    <div className="md:max-w-md w-full">
                      <img
                        src="https://images.shadcnspace.com/assets/backgrounds/newsletter-image.webp"
                        alt="newsletter"
                        className="w-full object-cover sm:h-full h-40"
                      />
                    </div>
                    <div className="md:p-16 p-6 w-full">
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                          <h2 className="text-card-foreground text-3xl font-medium">
                            Subscribe to the latest updates of Shadcn Space
                          </h2>
                          <p className="text-muted-foreground text-base font-normal">
                            Subscribe our newsletters and get the latest business updates
                          </p>
                        </div>
                        <form className="flex flex-col gap-4">
                          <div className="flex flex-col gap-3">
                            <Input
                              id="email"
                              type="email"
                              placeholder="example@shadcnspace.com"
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
                          <div className="flex flex-row items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <Checkbox id="newsletter" className="cursor-pointer" />
                              <FieldLabel
                                htmlFor="newsletter"
                                className="text-sm text-primary font-normal cursor-pointer"
                              >
                                Don&apos;t show this popup again
                              </FieldLabel>
                            </div>
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
