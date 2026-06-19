"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/ui/sonner";
import { TooltipProvider } from "@/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { OrgProvider } from "@/contexts/org-context";
import LearnHubLayout from "@/layouts/LearnHubLayout";

export default function LearnProviders({ children }: { children: ReactNode }) {
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
          <AuthProvider>
            <TooltipProvider>
              <Toaster position="top-right" toastOptions={{ style: { marginTop: "0.25rem" } }} />
              <LearnHubLayout>{children}</LearnHubLayout>
            </TooltipProvider>
          </AuthProvider>
        </OrgProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
