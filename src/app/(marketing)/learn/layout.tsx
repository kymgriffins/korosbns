import { LearnProvider } from "@/contexts/learn-context";
import { Suspense } from "react";
import { LearnTabSync } from "@/components/learn/learn-tab-sync";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";
import AppSidebar from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <LearnProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }>
        <LearnTabSync />
        <AppSidebar>
          {/*
            Scroll lives on AppSidebar <main>. This wrapper only pads for the
            fixed mobile bottom nav and must not introduce another overflow.
          */}
          <div className="min-h-0 w-full pb-[--mobile-nav-height] lg:pb-0">
            {children}
          </div>
          <LearnMobileNav />
        </AppSidebar>
      </Suspense>
    </LearnProvider>
  );
}
