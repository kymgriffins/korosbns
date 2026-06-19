import FlareCursor from "@/components/global/flare-cursor";
import LoadingScreen from "@/components/global/loading-screen";
import Providers from "@/components/global/providers";
import WhatsAppSupport from "@/components/global/whatsapp-support";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { fontVars } from "@/lib/fonts/registry";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { ThemeBootScript } from "@/scripts/theme-boot";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import { Analytics } from "@vercel/analytics/next";
import type { Viewport } from "next";
import Script from "next/script";

export const viewport: Viewport = {
  themeColor: "#020817",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://budgetndiostory.org";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme_mode, theme_preset, content_layout, navbar_style, sidebar_variant, sidebar_collapsible, font: prefFont } =
    PREFERENCE_DEFAULTS;

  return (
    <html
      lang="en"
      data-theme-mode={theme_mode}
      data-theme-preset={theme_preset}
      data-content-layout={content_layout}
      data-navbar-style={navbar_style}
      data-sidebar-variant={sidebar_variant}
      data-sidebar-collapsible={sidebar_collapsible}
      data-font={prefFont}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://bnske.budgetndiostory.org" />
        <ThemeBootScript />
      </head>
      <body className={`${fontVars} min-h-screen antialiased`}>
        <Providers>
          <TooltipProvider>
          <PreferencesStoreProvider
            themeMode={theme_mode}
            themePreset={theme_preset}
            contentLayout={content_layout}
            navbarStyle={navbar_style}
            font={prefFont}
          >
            <LoadingScreen />
            <FlareCursor />
            <WhatsAppSupport />
            {children}
            <Toaster />
          </PreferencesStoreProvider>
          </TooltipProvider>
        </Providers>
        <Analytics />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wugt5any7z");`}
        </Script>
        <Script id="register-sw" strategy="afterInteractive">
          {`if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`}
        </Script>
      </body>
    </html>
  );
}
