"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import React, { useState } from "react";

const ThemeProvider = NextThemeProvider as unknown as React.FC<
  React.ComponentProps<typeof NextThemeProvider> & { children?: React.ReactNode }
>;
import { Toaster } from "@/ui/sonner";
import { TooltipProvider } from "@/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { OrgProvider } from "@/contexts/org-context";
import SentryErrorBoundary from "@/components/error/error-boundary";
import { DebugLogPanel } from "@/components/debug/debug-log-panel";
import { PostHogProvider } from "@/components/global/posthog-provider";
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
                  <PostHogProvider>
                    <Toaster position="top-right" toastOptions={{ style: { marginTop: "0.25rem" } }} />
                    {children}
                    <DebugLogPanel />
                  </PostHogProvider>
                </TooltipProvider>
              </AuthProvider>
          </SentryErrorBoundary>
        </OrgProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;

