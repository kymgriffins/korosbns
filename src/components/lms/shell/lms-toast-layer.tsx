/**
 * @sdp-provenance
 * intent: INTENT-001
 * capability: CAP-learning-shell
 * contracts: CTR-lms-shell@1.0.0
 * builder: SDP-Builder
 * date: 2026-07-07
 */
"use client";

import { Toaster } from "@/components/ui/sonner";

export function LmsToastLayer() {
  return (
    <Toaster
      id="learn"
      position="top-center"
      className="learn-toaster"
      toastOptions={{
        classNames: {
          toast: "learn-toast",
        },
      }}
    />
  );
}
