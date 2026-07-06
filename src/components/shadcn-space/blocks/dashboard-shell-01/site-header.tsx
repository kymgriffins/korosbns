"use client";

import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropdown from "@/components/shadcn-space/blocks/dashboard-shell-01/user-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationDropdown from "@/components/shadcn-space/blocks/dashboard-shell-01/notification-dropdown";
import { BellRing, SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAuth } from "@/contexts/auth-context";
import { usePathname, useSearchParams } from "next/navigation";
import { getLearnNavByLocation } from "@/lib/learn-shell-nav";

function getDisplayName(user: ReturnType<typeof useAuth>["user"]) {
  if (!user) return "Learner";
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return user.display_name || user.break_name || full || user.email || "Learner";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "BN";
}

export function SiteHeader() {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeNav = getLearnNavByLocation(pathname, tabParam);

  const displayName = getDisplayName(user);
  const avatarUrl = user?.avatar_url ?? undefined;
  const initials = getInitials(displayName);

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger className="-ml-1 size-8 cursor-pointer" />
        <div className="hidden min-w-0 md:block">
          <p className="truncate text-sm font-semibold text-foreground">
            {activeNav?.title ?? "Learn hub"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {activeNav?.dataHint ?? "Civic budget education for Kenya"}
          </p>
        </div>
        <InputGroup className="h-9 max-w-md flex-1 rounded-full">
          <InputGroupInput placeholder="Search modules, documents, forum…" />
          <InputGroupAddon>
            <SearchIcon className="size-4" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <NotificationDropdown
          defaultOpen={false}
          align="center"
          trigger={
            <button
              type="button"
              className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Notifications"
            >
              <BellRing className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
            </button>
          }
        />
        <UserDropdown
          defaultOpen={false}
          align="center"
          trigger={
            <button type="button" className="rounded-full" aria-label="Account menu">
              <Avatar className="size-8 cursor-pointer">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={displayName} />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          }
        />
        {!user ? (
          <Link
            href="/auth/login"
            className="hidden text-xs font-semibold text-primary hover:underline sm:inline"
          >
            Sign in
          </Link>
        ) : null}
      </div>
    </div>
  );
}
