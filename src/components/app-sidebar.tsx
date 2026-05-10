"use client";

import { type Icon } from "@tabler/icons-react";
import Image from "next/image";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SIDEBAR_GROUPS, MAX_PRIMARY_SIDEBAR_ITEMS } from "@/constants/sidebar";

const data = {
  user: {
    name: "Admin",
    email: "admin@budgetndiostory.org",
    avatar: "/avatars/admin.jpg",
  },
};

type SidebarNavItem = {
  title: string;
  url: string;
  icon?: Icon;
  onClick?: () => void;
  isActive?: boolean;
  children?: SidebarNavItem[];
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navMainItems?: SidebarNavItem[];
  orgItems?: SidebarNavItem[];
  governanceItems?: SidebarNavItem[];
  models?: Array<{ name: string; verbose_name: string }>;
  activeModel?: string;
  onModelSelect?: (name: string) => void;
  user?: { name: string; email: string; avatar?: string };
  onManageAccount?: () => void;
}

export function AppSidebar({
  navMainItems,
  orgItems,
  governanceItems,
  models,
  activeModel,
  onModelSelect,
  user,
  onManageAccount,
  ...props
}: AppSidebarProps) {
  const userData = user ?? data.user;

  // Build the sidebar items dynamically from SIDEBAR_GROUPS
  const sidebarItems = React.useMemo(() => {
    if (!models) return navMainItems ?? [];

    const groupedModelNames = new Set(SIDEBAR_GROUPS.flatMap(g => g.models));
    
    const items = SIDEBAR_GROUPS.map((group) => {
      // Special case for dashboard
      if (group.id === "overview") {
        return {
          title: group.title,
          url: "#",
          icon: group.icon,
          onClick: () => onModelSelect?.(""),
          isActive: activeModel === "" || activeModel === "dashboard",
        };
      }

      const groupChildren = (models ?? [])
        .filter((model) => group.models.includes(model.name))
        .map((model) => ({
          title: model.verbose_name,
          url: "#",
          onClick: () => onModelSelect?.(model.name),
          isActive: activeModel === model.name,
        }));

      if (groupChildren.length === 0) return null;

      return {
        title: group.title,
        url: "#",
        icon: group.icon,
        children: groupChildren,
      };
    }).filter(Boolean) as SidebarNavItem[];

    // Add uncategorized models to the System group or as a separate group if System doesn't exist
    const uncategorized = (models ?? [])
      .filter((model) => !groupedModelNames.has(model.name))
      .map((model) => ({
        title: model.verbose_name,
        url: "#",
        onClick: () => onModelSelect?.(model.name),
        isActive: activeModel === model.name,
      }));

    if (uncategorized.length > 0) {
      const systemItem = items.find(i => i.title === "System");
      if (systemItem) {
        systemItem.children = [...(systemItem.children ?? []), ...uncategorized];
      } else {
        // Find icons for the last item or use a default
        items.push({
          title: "Other",
          url: "#",
          children: uncategorized,
        });
      }
    }

    return items;
  }, [models, activeModel, onModelSelect, navMainItems]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-0!"
            >
              <a
                href="/"
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Image
                    src="/logo.svg"
                    alt="BNS logo"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-primary">
                    BNS Hub
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Admin portal
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={sidebarItems.slice(0, MAX_PRIMARY_SIDEBAR_ITEMS)}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar ?? "/avatars/admin.jpg",
          }}
          onManageAccount={onManageAccount}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

