"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { LearnProvider } from "@/contexts/learn-context";
import { LearnTabSync } from "@/components/learn/learn-tab-sync";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/app/(marketing)/learn/_components/app-sidebar";
import { LearnMobileNav } from "@/app/(marketing)/learn/_components/learn-mobile-nav";

export function LearnHubShell({
  defaultOpen,
  children,
}: {
  defaultOpen: boolean;
  children: ReactNode;
}) {
  return (
    <LearnProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        }
      >
        <LearnTabSync />
        <SidebarProvider
          defaultOpen={defaultOpen}
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 68)",
            } as React.CSSProperties & Record<string, string>
          }
        >
          <AppSidebar />
          <SidebarInset
            className={cn(
              "[html[data-content-layout=centered]_&>*]:mx-auto",
              "[html[data-content-layout=centered]_&>*]:w-full",
              "[html[data-content-layout=centered]_&>*]:max-w-screen-2xl",
              "peer-data-[variant=inset]:border",
              "[--dashboard-header-height:--spacing(12)]",
              "min-w-0 overflow-x-hidden",
            )}
          >
            <header
              className={cn(
                "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
                "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
              )}
            >
              <div className="flex w-full items-center justify-between px-4 lg:px-6">
                <div className="flex items-center gap-1 lg:gap-2">
                  <SidebarTrigger className="-ml-1" />
                </div>
              </div>
            </header>
            <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden p-4 pb-[--mobile-nav-height] has-data-[content-padding=false]:p-0 md:p-6 md:pb-[--mobile-nav-height] lg:pb-0 md:has-data-[content-padding=false]:p-0">
              {children}
            </div>
            <LearnMobileNav />
          </SidebarInset>
        </SidebarProvider>
      </Suspense>
    </LearnProvider>
  );
}
