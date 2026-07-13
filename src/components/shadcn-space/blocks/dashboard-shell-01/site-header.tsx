"use client";

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
import { TeachingToggle } from "@/components/admin/teaching";

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
  const displayName = getDisplayName(user);
  const avatarUrl = user?.avatar_url ?? undefined;
  const initials = getInitials(displayName);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 h-8 w-8 cursor-pointer" />
        <InputGroup className="h-9 rounded-md">
          <InputGroupInput placeholder="Search modules, documents..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex items-center gap-3">
        <TeachingToggle
          title="Learning tips"
          description="Guides for each Learning Hub page. Mute anytime — learning still works without them."
        />
        <NotificationDropdown
          defaultOpen={false}
          align="center"
          trigger={
            <div className="rounded-full p-2 hover:bg-accent relative before:absolute before:bottom-0 before:left-1/2 before:z-10 before:w-2 before:h-2 before:rounded-full before:bg-red-500 before:top-1 cursor-pointer">
              <BellRing className="size-4" />
            </div>
          }
        />
        <UserDropdown
          defaultOpen={false}
          align="center"
          trigger={
            <div className="rounded-full">
              <Avatar className="size-8 cursor-pointer">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={displayName} />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
          }
        />
      </div>
    </div>
  );
}
