"use client";

import { usePathname } from "next/navigation";
import { LmsShell } from "@/components/lms/lms-shell";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAccount = pathname.startsWith("/learn/account");

  if (isAccount) {
    return <div className="min-h-dvh bg-background">{children}</div>;
  }

  return <LmsShell>{children}</LmsShell>;
}
