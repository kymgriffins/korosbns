"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import React, { useState } from "react";
import { Toaster } from "@/ui/sonner";
import { TooltipProvider } from "@/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { OrgProvider } from "@/contexts/org-context";
import SentryErrorBoundary from "@/components/error/error-boundary";
import { DebugLogPanel } from "@/components/debug/debug-log-panel";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <OrgProvider>
          <SentryErrorBoundary>
            <AuthProvider>
              <TooltipProvider>
                <Toaster position="top-right" toastOptions={{ style: { marginTop: "0.25rem" } }} />
                {children}
                <DebugLogPanel />
              </TooltipProvider>
            </AuthProvider>
          </SentryErrorBoundary>
        </OrgProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;

