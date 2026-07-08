"use client";

import { usePathname } from "next/navigation";
import "@/styles/lms.css";
import { LmsErrorBoundary, LmsErrorFallback } from "@/components/lms/providers/lms-error-boundary";
import { LmsProviders } from "@/components/lms/providers/lms-providers";
import { LearningRuntimeProvider } from "@/lib/learning-runtime";
import { LearningShell } from "@/components/lms/shell/learning-shell";
import { resolveShellMode } from "@/components/lms/shell/types";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mode = resolveShellMode(pathname);

  if (mode === "account") {
    return (
      <LmsProviders>
        <LearningRuntimeProvider>
          <div className="learn-root min-h-dvh bg-background">{children}</div>
        </LearningRuntimeProvider>
      </LmsProviders>
    );
  }

  return (
    <LmsProviders>
      <LearningRuntimeProvider>
        <LmsErrorBoundary fallback={<LmsErrorFallback />}>
          <LearningShell mode={mode}>{children}</LearningShell>
        </LmsErrorBoundary>
      </LearningRuntimeProvider>
    </LmsProviders>
  );
}
