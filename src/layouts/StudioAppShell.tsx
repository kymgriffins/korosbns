"use client";

import { usePathname } from "next/navigation";
import { useStudioTheme } from "@/contexts/studio-theme-context";
import { Header } from "@/layouts/Header";
import MinimalFooter from "@/components/global/minimal-footer";

type Props = {
  children: React.ReactNode;
};

/** Unified Studio App Shell - mounts global BNS Header and Minimal Footer */
export function StudioAppShell({ children }: Props) {
  const { theme } = useStudioTheme();
  const pathname = usePathname();
  // Pages like /bns-studio/about clear the fixed navbar; the full-screen reel hero on /bns-studio fills 100dvh directly under glass nav
  const needsNavOffset = pathname.startsWith("/bns-studio/about");

  return (
    <div
      data-studio-theme={theme}
      className="studio-app studio-theatre min-h-dvh w-full flex flex-col"
    >
      <Header />
      <main className={`flex-1 flex flex-col ${needsNavOffset ? "pt-12 md:pt-16 lg:pt-20" : ""}`}>
        {children}
      </main>
      <div className="mt-auto shrink-0">
        <MinimalFooter />
      </div>
    </div>
  );
}
