/**
 * @sdp-provenance
 * intent: INTENT-001
 * capability: CAP-learning-shell
 * requirements: REQ-0012, REQ-0014
 * contracts: CTR-lms-shell@1.0.0
 * builder: SDP-Builder
 * date: 2026-07-07
 */
"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils";
import { LmsBottomNav } from "@/components/lms/shell/lms-bottom-nav";
import { LmsTopNav } from "@/components/lms/shell/lms-top-nav";
import { LmsBottomSheetLayer } from "@/components/lms/shell/lms-bottom-sheet-layer";
import { LmsDialogLayer } from "@/components/lms/shell/lms-dialog-layer";
import { LmsToastLayer } from "@/components/lms/shell/lms-toast-layer";
import { SHELL_LAYERS_BY_MODE, type LmsShellMode } from "@/components/lms/shell/types";

type LearningShellProps = {
  mode: LmsShellMode;
  children: ReactNode;
};

export function LearningShell({ mode, children }: LearningShellProps) {
  const layers = SHELL_LAYERS_BY_MODE[mode];

  return (
    <div className="learn-root flex min-h-dvh flex-col bg-[var(--ljp-page-bg)] dark:bg-[var(--ljp-canvas)]">
      {layers.topNav ? <LmsTopNav /> : null}
      <main
        id="lms-main"
        className={cn(
          "flex min-h-0 flex-1 flex-col pt-4 md:pt-6 lg:pt-8",
          layers.bottomNav && "pb-[var(--mobile-nav-height)] lg:pb-0",
        )}
      >
        {children}
      </main>
      {layers.bottomNav ? <LmsBottomNav /> : null}
      {layers.toast ? <LmsToastLayer /> : null}
      {layers.dialog ? <LmsDialogLayer /> : null}
      {layers.bottomSheetHost ? <LmsBottomSheetLayer /> : null}
    </div>
  );
}
