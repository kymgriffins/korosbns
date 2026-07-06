"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LucideIcon,
  CircleUserRound,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Routes } from "@/constants/routes";

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

type MenuItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  destructive?: boolean;
};

const PROFILE_ITEMS: MenuItem[] = [
  { label: "My Profile", icon: CircleUserRound, href: Routes.LearnProfile },
  { label: "Account Settings", icon: Settings, href: "/learn/account" },
];

const itemClass =
  "p-2 text-sm font-medium text-popover-foreground cursor-pointer gap-2";

function getDisplayName(user: ReturnType<typeof useAuth>["user"]) {
  if (!user) return "Learner";
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return user.display_name || user.break_name || full || "Learner";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "BN";
}

const UserDropdown = ({ trigger, defaultOpen, align = "end" }: Props) => {
  const { user, logout } = useAuth();
  const displayName = getDisplayName(user);
  const email = user?.email ?? "";
  const avatarUrl = user?.avatar_url ?? undefined;
  const initials = getInitials(displayName);

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className="w-3xs rounded-2xl data-open:slide-in-from-bottom-20! data-closed:slide-out-to-bottom-20 data-open:fade-in-0 data-closed:fade-out-0 data-closed:zoom-out-100 duration-400"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-3 px-4 py-3">
              <div className="relative">
                <Avatar className="data-[size=lg]:size-8">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={displayName} />
                  ) : null}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                {user ? (
                  <span className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2" />
                ) : null}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-popover-foreground text-sm font-medium truncate">
                  {displayName}
                </span>
                {email ? (
                  <span className="text-muted-foreground text-sm truncate">
                    {email}
                  </span>
                ) : null}
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {PROFILE_ITEMS.map(({ label, icon: Icon, href }) => (
              <DropdownMenuItem key={label} className={itemClass} asChild>
                <Link href={href}>
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            className={itemClass}
            onClick={() => void logout()}
          >
            <LogOut size={20} />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
