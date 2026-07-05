"use client";

import { cn } from "@/lib/utils";

export function StudioPage({
  children,
  className,
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "narrow" | "default" | "wide" | "full";
}) {
  return (
    <div
      className={cn(
        "mx-auto px-4 py-8 md:px-6 md:py-10",
        width === "narrow" && "max-w-2xl",
        width === "default" && "max-w-3xl",
        width === "wide" && "max-w-5xl",
        width === "full" && "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
