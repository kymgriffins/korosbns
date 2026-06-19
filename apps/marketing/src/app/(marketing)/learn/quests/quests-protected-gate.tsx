"use client";

import { Protected } from "@/components/citizen/protected";

export function QuestsProtectedGate({ children }: { children: React.ReactNode }) {
  return <Protected>{children}</Protected>;
}
