"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { LearnProvider } from "@/contexts/learn-context";
import { LearnTabSync } from "@/components/learn/learn-tab-sync";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
          <SidebarInset className="min-w-0 overflow-x-hidden">
            <header className="flex h-12 shrink-0 items-center border-b bg-background px-4 lg:px-6">
              <SidebarTrigger className="-ml-1" />
            </header>
            <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden p-4 pb-[--mobile-nav-height] md:p-6 md:pb-[--mobile-nav-height] lg:pb-0">
              {children}
            </div>
            <LearnMobileNav />
          </SidebarInset>
        </SidebarProvider>
      </Suspense>
    </LearnProvider>
  );
}
