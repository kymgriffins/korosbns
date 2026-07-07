"use client";

import { LmsBottomNav, LmsTopNav } from "@/components/lms/lms-nav";
import { cn } from "@/utils";

type LmsShellProps = {
  children: React.ReactNode;
  /** Lesson pages hide bottom nav for immersive content */
  immersive?: boolean;
};

export function LmsShell({ children, immersive = false }: LmsShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <LmsTopNav />
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          !immersive && "pb-[var(--mobile-nav-height)] lg:pb-0",
        )}
      >
        {children}
      </div>
      {!immersive ? <LmsBottomNav /> : null}
    </div>
  );
}
