"use client";

import Link from "next/link";
import { BookOpen, Clapperboard, Brain } from "lucide-react";
import { cn } from "@/utils";
import type { ImmersiveMode } from "@/lib/immersive-module";

type SegmentItem = {
  mode: ImmersiveMode;
  label: string;
  href: string;
  hidden?: boolean;
};

export function ImmersiveSegment({
  items,
  active,
}: {
  items: SegmentItem[];
  active: ImmersiveMode;
}) {
  const visible = items.filter((i) => !i.hidden);
  if (visible.length <= 1) return null;

  const icons = { read: BookOpen, watch: Clapperboard, quiz: Brain };

  return (
    <nav
      className="immersive-segment mx-auto my-3 flex w-full max-w-md rounded-xl border border-foreground/10 bg-muted/40 p-1 backdrop-blur-xs"
      aria-label="Learning mode"
    >
      {visible.map((item) => {
        const Icon = icons[item.mode];
        const isActive = active === item.mode;
        return (
          <Link
            key={item.mode}
            href={item.href}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-mono font-bold transition-all",
              isActive
                ? "bg-card text-foreground shadow-xs border border-foreground/10"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className={cn("size-3.5", isActive ? "text-orange-500" : "text-muted-foreground")} aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
