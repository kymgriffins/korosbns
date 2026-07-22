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
      className="immersive-segment mx-4 mb-4 flex rounded-[0.875rem] bg-muted/70 p-1"
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
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
