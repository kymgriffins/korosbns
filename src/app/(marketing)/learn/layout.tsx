import { LearnProvider } from "@/contexts/learn-context";
import { Suspense } from "react";
import { LearnTabSync } from "@/components/learn/learn-tab-sync";
import { LearnMobileNav } from "@/layouts/LearnMobileNav";
import { BudgetHubShell } from "@/components/budget-hub/layout/budget-hub-shell";
import "@/styles/budget-hub.css";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <LearnProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }>
        <LearnTabSync />
        <BudgetHubShell footer={<LearnMobileNav />}>
          {children}
        </BudgetHubShell>
      </Suspense>
    </LearnProvider>
  );
}
