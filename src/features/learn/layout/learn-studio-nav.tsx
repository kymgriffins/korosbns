"use client";

import Link from "next/link";
import { BookOpen, FileText, Home, MessagesSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { learnTabToHref } from "@/lib/learn-nav";
import type { LearnTab } from "@/contexts/learn-context";

const NAV: { tab: LearnTab; label: string; icon: typeof Home; href: string }[] = [
  { tab: "home", label: "Home", icon: Home, href: learnTabToHref("home") },
  { tab: "learn", label: "Path", icon: BookOpen, href: learnTabToHref("learn") },
  { tab: "documents", label: "Documents", icon: FileText, href: learnTabToHref("documents") },
  { tab: "forum", label: "Forum", icon: MessagesSquare, href: learnTabToHref("forum") },
  { tab: "profile", label: "You", icon: User, href: learnTabToHref("profile") },
];

export function LearnStudioNav({
  activeTab,
  onSelect,
  className,
}: {
  activeTab: LearnTab;
  onSelect?: (tab: LearnTab) => void;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65",
        "pb-[max(0.5rem,env(safe-area-inset-bottom))] md:static md:border-t-0 md:border-r md:bg-transparent md:backdrop-blur-none md:pb-0",
        className,
      )}
      aria-label="Learn navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around gap-1 px-2 py-2 md:max-w-none md:flex-col md:justify-start md:gap-0.5 md:px-2 md:py-4">
        {NAV.map(({ tab, label, icon: Icon, href }) => {
          const active = activeTab === tab;
          const inner = (
            <>
              <Icon className={cn("size-5 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-[10px] font-medium md:text-xs", active ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
            </>
          );
          const classNames = cn(
            "flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 transition-colors md:flex-row md:justify-start md:gap-3 md:px-3 md:py-2.5",
            active ? "bg-primary/10 text-foreground" : "hover:bg-muted/60",
          );
          if (onSelect && (tab === "home" || tab === "learn" || tab === "profile")) {
            return (
              <li key={tab} className="flex-1 md:flex-none">
                <button type="button" onClick={() => onSelect(tab)} className={cn(classNames, "w-full")}>
                  {inner}
                </button>
              </li>
            );
          }
          return (
            <li key={tab} className="flex-1 md:flex-none">
              <Link href={href} className={classNames}>
                {inner}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
