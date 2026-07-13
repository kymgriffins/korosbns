import { LearnProvider } from "@/contexts/learn-context";
import { Suspense } from "react";
import { LearnTabSync } from "@/components/learn/learn-tab-sync";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";
import AppSidebar from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <LearnProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        }
      >
        <LearnTabSync />
        <AppSidebar bottom={<LearnMobileNav />}>{children}</AppSidebar>
      </Suspense>
    </LearnProvider>
  );
}
