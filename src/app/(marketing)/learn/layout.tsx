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
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto pb-[--mobile-nav-height] lg:pb-0">
              {children}
            </div>
            <LearnMobileNav />
          </div>
        </AppSidebar>
      </Suspense>
    </LearnProvider>
  );
}
