"use client";

import { Protected } from "@/components/citizen/protected";

export function AccountProtectedGate({ children }: { children: React.ReactNode }) {
  return <Protected>{children}</Protected>;
}
