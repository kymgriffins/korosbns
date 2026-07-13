"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { navBottomEnter } from "@/motion/variants";
import { cn } from "@/utils";

export type MobileBottomNavItem = {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  /** Called when a link item is activated (e.g. close overflow menu) */
  onNavigate?: () => void;
  active?: boolean;
  prominent?: boolean;
  ariaCurrent?: "page" | undefined;
  ariaExpanded?: boolean;
};

type MobileBottomNavProps = {
  items: MobileBottomNavItem[];
  ariaLabel: string;
  className?: string;
  /** fixed = viewport overlay; embedded = in-flow flex sibling (learn shell) */
  placement?: "fixed" | "embedded";
};

export function MobileBottomNav({
  items,
  ariaLabel,
  className,
  placement = "fixed",
}: MobileBottomNavProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.nav
      variants={prefersReducedMotion ? undefined : navBottomEnter}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
      className={cn(
        "flex w-full items-center justify-around border-t border-border bg-background/95 px-2 backdrop-blur-md lg:hidden",
        /* Height = bar content + home-indicator inset (outside the icon row). */
        "min-h-[var(--mobile-nav-height)] pb-[env(safe-area-inset-bottom,0px)]",
        placement === "fixed"
          ? "fixed bottom-0 inset-x-0 z-40"
          : "relative z-40 shrink-0",
        className
      )}
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const content = item.prominent ? (
          <>
            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform duration-200",
                item.active && "scale-105 ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
              )}
            >
              {item.icon}
            </div>
            <span
              className={cn(
                "mt-0.5 text-[9px] font-semibold tracking-tight transition-colors",
                item.active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </span>
          </>
        ) : (
          <>
            <div
              className={cn(
                "rounded-xl p-1.5 transition-all duration-200",
                item.active
                  ? "scale-105 bg-primary/10 text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              {item.icon}
            </div>
            <span
              className={cn(
                "mt-0.5 text-[9px] font-semibold tracking-tight transition-colors",
                item.active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </span>
          </>
        );

        const itemClass = item.prominent
          ? "group flex h-full flex-1 flex-col items-center justify-center py-0 text-center relative"
          : "group flex h-full flex-1 flex-col items-center justify-center py-1 text-center";

        if (item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              className={itemClass}
              aria-current={item.ariaCurrent}
              onClick={item.onNavigate}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            className={itemClass}
            aria-current={item.ariaCurrent}
            aria-expanded={item.ariaExpanded}
            aria-haspopup={item.id === "more" ? "dialog" : undefined}
          >
            {content}
          </button>
        );
      })}
    </motion.nav>
  );
}

/** Resolve active tab from pathname + optional prefix rules */
export function isMobileNavActive(
  pathname: string,
  href: string | undefined,
  matchPrefixes?: string[]
): boolean {
  if (!href && !matchPrefixes?.length) return false;

  const prefixes = matchPrefixes ?? (href ? [href] : []);

  for (const prefix of prefixes) {
    if (prefix === "/") {
      if (pathname === "/") return true;
      continue;
    }
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return true;
    }
  }

  return false;
}
