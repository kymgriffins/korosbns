import "@/app/globals.css";
import { cookies } from "next/headers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { fontVars } from "@/lib/fonts/registry";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import {
  THEME_MODE_VALUES,
  THEME_PRESET_VALUES,
} from "@/lib/preferences/theme";
import {
  CONTENT_LAYOUT_VALUES,
  NAVBAR_STYLE_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  SIDEBAR_VARIANT_VALUES,
} from "@/lib/preferences/layout";
import { type FontKey, fontRegistry } from "@/lib/fonts/registry";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

function readCookie<T extends string>(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  const raw = cookieStore.get(key)?.value?.trim();
  return allowed.includes(raw as T) ? (raw as T) : fallback;
}

export default async function BudgethubLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  const theme_mode = readCookie(cookieStore, "theme_mode", THEME_MODE_VALUES, PREFERENCE_DEFAULTS.theme_mode);
  const theme_preset = readCookie(cookieStore, "theme_preset", THEME_PRESET_VALUES, PREFERENCE_DEFAULTS.theme_preset);
  const content_layout = readCookie(cookieStore, "content_layout", CONTENT_LAYOUT_VALUES, PREFERENCE_DEFAULTS.content_layout);
  const navbar_style = readCookie(cookieStore, "navbar_style", NAVBAR_STYLE_VALUES, PREFERENCE_DEFAULTS.navbar_style);
  const sidebar_variant = readCookie(cookieStore, "sidebar_variant", SIDEBAR_VARIANT_VALUES, PREFERENCE_DEFAULTS.sidebar_variant);
  const sidebar_collapsible = readCookie(cookieStore, "sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, PREFERENCE_DEFAULTS.sidebar_collapsible);

  const FONT_VALUES = Object.keys(fontRegistry) as FontKey[];
  const font = readCookie(cookieStore, "font", FONT_VALUES, PREFERENCE_DEFAULTS.font);

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
            font +
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
            font={font}
            sidebarVariant={sidebar_variant}
            sidebarCollapsible={sidebar_collapsible}
            isSynced={true}
          >
            {children}
            <Toaster />
          </PreferencesStoreProvider>
        </TooltipProvider>
      </div>
    </>
  );
}
