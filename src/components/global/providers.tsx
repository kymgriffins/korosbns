"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import React, { Suspense, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { OrgProvider } from "@/contexts/org-context";
import SentryErrorBoundary from "@/components/error/error-boundary";
import { DebugLogPanel } from "@/components/debug/debug-log-panel";
import { PostHogProvider } from "@/components/global/posthog-provider";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { PageviewBeacon } from "@/components/analytics/pageview-beacon";

import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";

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
      <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
        <OrgProvider>
          <SentryErrorBoundary>
            <AuthProvider>
              <TooltipProvider>
                <PostHogProvider>
                  <PreferencesStoreProvider
                    themeMode={PREFERENCE_DEFAULTS.theme_mode}
                    themePreset={PREFERENCE_DEFAULTS.theme_preset}
                    contentLayout={PREFERENCE_DEFAULTS.content_layout}
                    navbarStyle={PREFERENCE_DEFAULTS.navbar_style}
                    font={PREFERENCE_DEFAULTS.font}
                  >
                    <Toaster position="top-right" toastOptions={{ style: { marginTop: "0.25rem" } }} />
                    <Suspense fallback={null}>
                      <PageviewBeacon />
                    </Suspense>
                    <SmoothScrollProvider>
                      {children}
                    </SmoothScrollProvider>
                    <DebugLogPanel />
                  </PreferencesStoreProvider>
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
