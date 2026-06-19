"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { type ReactNode } from "react";

export default function LearnProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
