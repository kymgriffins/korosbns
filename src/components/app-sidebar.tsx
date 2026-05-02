"use client";

import {
  IconBook2,
  IconClipboardList,
  IconGauge,
  IconNews,
  IconUserShield,
  type Icon,
} from "@tabler/icons-react";
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

const data = {
  user: {
    name: "Admin",
    email: "admin@budgetndiostory.org",
    avatar: "/avatars/admin.jpg",
  },
};

const MAX_PRIMARY_SIDEBAR_ITEMS = 5;

const defaultNavMain = [
  {
    title: "Dashboard",
    url: "#",
    icon: IconGauge,
  },
  {
    title: "Duty",
    url: "#",
    icon: IconClipboardList,
  },
  {
    title: "Budget Academy",
    url: "#",
    icon: IconBook2,
  },
  {
    title: "CMS",
    url: "#",
    icon: IconNews,
  },
  {
    title: "Organization",
    url: "#",
    icon: IconUserShield,
  },
];

type SidebarNavItem = {
  title: string;
  url: string;
  icon?: Icon;
  onClick?: () => void;
  isActive?: boolean;
};

const SIDEBAR_MODEL_GROUPS: Array<{ title: string; models: string[] }> = [
  {
    title: "Operations",
    models: ["activity", "project", "impactmetric", "roadmapitem"],
  },
  {
    title: "Learn Hub",
    models: [
      "trivia",
      "story",
      "deepdivearticle",
      "knowledgeentry",
      "document",
      "docfolder",
    ],
  },
  {
    title: "Social & Media",
    models: ["campaign", "teamquote", "subscriber", "partner", "program"],
  },
  {
    title: "Developer Tools",
    models: [
      "organization",
      "teammember",
      "organizationmember",
      "user",
      "auditlog",
      "changelog",
      "versioninfo",
      "gamificationprofile",
      "pointevent",
    ],
  },
];

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
  const mainItems = navMainItems ?? defaultNavMain;
  const userData = user ?? data.user;

  const groupedByName = SIDEBAR_MODEL_GROUPS.map((group) => ({
    title: group.title,
    items: (models ?? [])
      .filter((model) => group.models.includes(model.name))
      .map((model) => ({
        title: model.verbose_name,
        url: "#",
        onClick: () => onModelSelect?.(model.name),
        isActive: activeModel === model.name,
      })),
  })).filter((group) => group.items.length > 0);

  const groupedModelNames = new Set(
    SIDEBAR_MODEL_GROUPS.flatMap((group) => group.models),
  );
  const uncategorizedModels = (models ?? [])
    .filter((model) => !groupedModelNames.has(model.name))
    .map((model) => ({
      title: model.verbose_name,
      url: "#",
      onClick: () => onModelSelect?.(model.name),
      isActive: activeModel === model.name,
    }));

  const groupChildren = (title: string) =>
    groupedByName.find((group) => group.title === title)?.items ?? [];

  const compactSidebarItems = [
    {
      title: "Dashboard",
      url: "#",
      icon: IconGauge,
    },
    {
      title: "Operations",
      url: "#",
      icon: IconClipboardList,
      children: groupChildren("Operations"),
    },
    {
      title: "Learning",
      url: "#",
      icon: IconBook2,
      children: groupChildren("Learn Hub"),
    },
    {
      title: "Social & Media",
      url: "#",
      icon: IconNews,
      children: groupChildren("Social & Media"),
    },
    {
      title: "Developer Tools",
      url: "#",
      icon: IconUserShield,
      children: groupChildren("Developer Tools").concat(uncategorizedModels),
    },
  ].slice(0, MAX_PRIMARY_SIDEBAR_ITEMS);

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
          items={
            compactSidebarItems.length > 0
              ? compactSidebarItems
              : mainItems.slice(0, MAX_PRIMARY_SIDEBAR_ITEMS)
          }
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
