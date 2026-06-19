import "@/app/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { fontVars } from "@/lib/fonts/registry";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

export default function BudgethubLayout({ children }: { children: React.ReactNode }) {
  const { theme_mode, theme_preset, content_layout, navbar_style, sidebar_variant, sidebar_collapsible, font: prefFont } =
    PREFERENCE_DEFAULTS;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "document.documentElement.setAttribute('data-theme-mode','" +
            theme_mode +
            "');" +
            "document.documentElement.setAttribute('data-theme-preset','" +
            theme_preset +
            "');" +
            "document.documentElement.setAttribute('data-content-layout','" +
            content_layout +
            "');" +
            "document.documentElement.setAttribute('data-navbar-style','" +
            navbar_style +
            "');" +
            "document.documentElement.setAttribute('data-sidebar-variant','" +
            sidebar_variant +
            "');" +
            "document.documentElement.setAttribute('data-sidebar-collapsible','" +
            sidebar_collapsible +
            "');" +
            "document.documentElement.setAttribute('data-font','" +
            prefFont +
            "');",
        }}
      />
      <div data-budgethub-theme className={fontVars}>
        <TooltipProvider>
          <PreferencesStoreProvider
            themeMode={theme_mode}
            themePreset={theme_preset}
            contentLayout={content_layout}
            navbarStyle={navbar_style}
            font={prefFont}
          >
            {children}
            <Toaster />
          </PreferencesStoreProvider>
        </TooltipProvider>
      </div>
    </>
  );
}
