"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-main";
import { SiteHeader } from "@/components/shadcn-space/blocks/dashboard-shell-01/site-header";
import { ArrowLeft } from "lucide-react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const AppSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border/60 bg-sidebar px-0 py-4">
        <div className="flex flex-col gap-4 bg-sidebar">
          <SidebarHeader className="px-4 py-0">
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/learn" className="flex h-full w-full items-center gap-2 py-1">
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
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Civic budget learning — choose your path, move at your pace.
            </p>
          </SidebarHeader>

          <SidebarContent className="gap-0 overflow-hidden px-0">
            <SimpleBar autoHide className="h-[calc(100vh-11rem)]">
              <div className="px-3 pb-4">
                <NavMain />
              </div>
            </SimpleBar>
          </SidebarContent>

          <SidebarFooter className="border-t border-border/60 px-4 pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Back to Budget Ndio Story
            </Link>
          </SidebarFooter>
        </div>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col bg-background">
        <header className="sticky top-0 z-50 hidden items-center border-b border-border/60 bg-background/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:flex">
          <Suspense fallback={<div className="h-9 w-full animate-pulse rounded-full bg-muted/40" />}>
            <SiteHeader />
          </Suspense>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default AppSidebar;
