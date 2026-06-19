import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

export default function BudgethubLayout({ children }: { children: ReactNode }) {
  const { theme_mode, theme_preset, content_layout, navbar_style, font } = PREFERENCE_DEFAULTS;

  return (
    <TooltipProvider>
      <PreferencesStoreProvider
        themeMode={theme_mode}
        themePreset={theme_preset}
        contentLayout={content_layout}
        navbarStyle={navbar_style}
        font={font}
      >
        {children}
        <Toaster />
      </PreferencesStoreProvider>
    </TooltipProvider>
  );
}
