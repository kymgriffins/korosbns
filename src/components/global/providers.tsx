"use client";

import { ThemeProvider } from "next-themes";
import React from "react";
import { Toaster } from "@/ui/sonner";
import { TooltipProvider } from "@/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { OrgProvider } from "@/contexts/org-context";
import SentryErrorBoundary from "@/components/error/error-boundary";
import { DebugLogPanel } from "@/components/debug/debug-log-panel";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <OrgProvider>
        <SentryErrorBoundary>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              {children}
              <DebugLogPanel />
            </TooltipProvider>
          </AuthProvider>
        </SentryErrorBoundary>
      </OrgProvider>
    </ThemeProvider>
  );
};

export default Providers;

