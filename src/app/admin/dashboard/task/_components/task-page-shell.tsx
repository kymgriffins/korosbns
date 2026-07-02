import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Full-width shell for admin task routes (board, detail, new, report). */
export function TaskPageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full min-w-0 flex flex-col gap-6 md:gap-8", className)}>{children}</div>
  );
}
