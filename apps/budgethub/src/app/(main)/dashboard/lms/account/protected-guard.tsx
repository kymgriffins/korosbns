"use client";

import { Protected } from "@/components/auth/protected";
import type { ReactNode } from "react";

export function ProtectedGuard({ children }: { children: ReactNode }) {
  return <Protected>{children}</Protected>;
}
