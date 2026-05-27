"use client";

import { Bell, BookOpen, Home, User } from "lucide-react";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import { cn } from "@/utils";

const HUB_SECTIONS: { key: LearnTab; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "learn", label: "Learn", icon: BookOpen },
  { key: "alerts", label: "Alerts", icon: Bell },
  { key: "profile", label: "Profile", icon: User },
];

export function LearnHubSectionTabs() {
  const { activeTab, setActiveTab } = useLearn();

  return (
    <nav
      className="sticky top-[var(--learn-hub-header-offset,3.25rem)] z-20 flex shrink-0 border-b border-border bg-card/95 backdrop-blur-md md:hidden"
      aria-label="Learning hub sections"
    >
      {HUB_SECTIONS.map((section) => {
        const Icon = section.icon;
        const active = activeTab === section.key;
        return (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveTab(section.key)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-center transition-colors",
              active
                ? "border-b-2 border-primary text-primary"
                : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4" aria-hidden />
            <span className="text-[9px] font-semibold tracking-tight">{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
