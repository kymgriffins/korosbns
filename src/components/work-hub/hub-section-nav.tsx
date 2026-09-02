"use client";

import { useEffect, useState } from "react";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

export type HubSectionLink = {
  id: string;
  label: string;
};

type HubSectionNavProps = {
  sections: HubSectionLink[];
  className?: string;
};

export function HubSectionNav({ sections, className }: HubSectionNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => node !== null);

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Work hub sections"
      className={cn(
        "sticky top-14 z-40 border-b border-border/40 bg-background/95 backdrop-blur-md md:top-16",
        className,
      )}
    >
      <div
        className={cn(
          SECTION_SHELL_INNER,
          "flex gap-1 overflow-x-auto py-3 scrollbar-hide",
        )}
      >
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              aria-current={isActive ? "location" : undefined}
            >
              {section.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
