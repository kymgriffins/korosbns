import React, { type ReactNode } from "react";
import { cn } from "@/utils";
import {
  type LayoutArchetype,
  resolveLayoutArchetype,
  LAYOUT_ARCHETYPES,
} from "./types";

export interface PageShellProps {
  children: ReactNode;
  archetype?: LayoutArchetype | string | null;
  className?: string;
  innerClassName?: string;
  bleedHeader?: boolean;
}

export function PageShell({
  children,
  archetype = "sovereign",
  className,
  innerClassName,
  bleedHeader = false,
}: PageShellProps) {
  const config = resolveLayoutArchetype(archetype);

  return (
    <div
      data-layout-archetype={config.id}
      className={cn(
        "w-full min-h-screen bg-background text-foreground transition-colors duration-300",
        config.id === "brutalist" && "selection:bg-foreground selection:text-background",
        config.id === "editorial" && "selection:bg-primary/20",
        config.id === "cinematic" && "selection:bg-sky-500/30",
        className
      )}
    >
      <main
        className={cn(
          config.containerMeasure,
          !bleedHeader && config.sectionPadding,
          innerClassName
        )}
      >
        {children}
      </main>
    </div>
  );
}
