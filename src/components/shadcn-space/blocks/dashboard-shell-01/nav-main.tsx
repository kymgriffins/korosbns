"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { isLearnNavHrefActive } from "@/lib/learn-nav";
import {
  LEARN_NAV_SECTIONS,
  learnNavGroupedBySection,
  type LearnShellNavItem,
} from "@/lib/learn-shell-nav";

function NavItemLink({ item, isActive }: { item: LearnShellNavItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem className="relative">
      {isActive ? (
        <motion.span
          layoutId="learn-nav-active"
          className="absolute inset-0 rounded-xl bg-primary/10 ring-1 ring-primary/20"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      ) : null}
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={isActive}
        className={cn(
          "relative h-auto min-h-11 rounded-xl px-3 py-2.5",
          isActive
            ? "bg-transparent text-primary hover:bg-transparent hover:text-primary"
            : "text-foreground/85 hover:bg-muted/60",
        )}
      >
        <Link href={item.href} prefetch className="items-start gap-3">
          <Icon
            className={cn(
              "mt-0.5 size-4 shrink-0",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
            aria-hidden
          />
          <span className="flex min-w-0 flex-col items-start gap-0.5 text-left">
            <span className="text-sm font-medium leading-none">{item.title}</span>
            <span className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
              {item.description}
            </span>
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavMainInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const groups = learnNavGroupedBySection();

  return (
    <>
      {groups.map(({ section, items }) => {
        const meta = LEARN_NAV_SECTIONS[section];
        return (
          <SidebarGroup key={section} className="p-0 pb-2">
            <SidebarGroupLabel className="px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground first:pt-0">
              {meta.label}
            </SidebarGroupLabel>
            <p className="px-2 pb-2 text-[10px] leading-relaxed text-muted-foreground/80">
              {meta.caption}
            </p>
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <NavItemLink
                  key={item.id}
                  item={item}
                  isActive={isLearnNavHrefActive(pathname, tabParam, item.href)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        );
      })}
    </>
  );
}

export function NavMain() {
  return (
    <Suspense
      fallback={
        <div className="space-y-2 px-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-11 animate-pulse rounded-xl bg-muted/50"
            />
          ))}
        </div>
      }
    >
      <NavMainInner />
    </Suspense>
  );
}
