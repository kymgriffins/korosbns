"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, BarChart3, MessageSquare, User,
  Flame, Search, Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/budget", label: "Dashboard", icon: LayoutDashboard },
  { href: "/budget/learn", label: "Learn", icon: BookOpen },
  { href: "/budget/insights", label: "Budgets", icon: BarChart3 },
  { href: "/budget/forum", label: "Community", icon: MessageSquare },
  { href: "/budget/profile", label: "Profile", icon: User },
];

export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-56 border-r border-[#e1e4e8] bg-white md:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2.5 border-b border-[#e1e4e8] px-5 py-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#020304]">
              <span className="text-sm font-bold text-white">B</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-[#020304]">BudgetHub</span>
          </div>
          <nav className="flex-1 space-y-0.5 px-3 py-4">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/budget"
                ? pathname === "/budget"
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#e8f5e9] text-[#006d37]"
                      : "text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#020304]",
                  )}
                >
                  <Icon className="size-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-[#e1e4e8] p-3">
            <div className="flex items-center gap-2.5 rounded-lg bg-[#f1f3f4] px-3 py-2">
              <Flame className="size-4 text-[#cea700]" />
              <span className="text-xs font-semibold text-[#735c00]">14-day streak</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#e1e4e8] bg-white/80 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-[#020304]">
            <span className="text-xs font-bold text-white">B</span>
          </div>
          <span className="text-sm font-bold text-[#020304]">BudgetHub</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex size-8 items-center justify-center rounded-full text-[#5f6368] hover:bg-[#f1f3f4]">
            <Search className="size-4" />
          </button>
          <button className="flex size-8 items-center justify-center rounded-full text-[#5f6368] hover:bg-[#f1f3f4]">
            <Bell className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className={cn("md:ml-56", "pb-20 md:pb-0")}>
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e1e4e8] bg-white md:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/budget"
              ? pathname === "/budget"
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive ? "text-[#006d37]" : "text-[#5f6368]",
                )}
              >
                <Icon className={cn("size-5", isActive && "drop-shadow-sm")} />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
