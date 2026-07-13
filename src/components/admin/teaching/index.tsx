"use client";

import type { ReactNode } from "react";

import { AdminTeachingProvider, LearnTeachingProvider } from "./teaching-context";
import { PageTeachingBanner } from "./page-teaching-banner";
import { TeachingToggle } from "./teaching-toggle";

export function AdminTeachingProviderShell({ children }: { children: ReactNode }) {
  return <AdminTeachingProvider>{children}</AdminTeachingProvider>;
}

export function LearnTeachingProviderShell({ children }: { children: ReactNode }) {
  return <LearnTeachingProvider>{children}</LearnTeachingProvider>;
}

export { TeachingToggle, PageTeachingBanner, LearnTeachingProvider, AdminTeachingProvider };
