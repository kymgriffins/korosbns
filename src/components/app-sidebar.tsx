"use client"

import * as React from "react"
import {
  IconGauge,
  IconInnerShadowTop,
  IconBook2,
  IconClipboardList,
  IconNews,
  IconUserShield,
  type Icon,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@budgetndiostory.org",
    avatar: "/avatars/admin.jpg",
  },
}

const MAX_PRIMARY_SIDEBAR_ITEMS = 5

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
]

type SidebarNavItem = {
  title: string
  url: string
  icon?: Icon
  onClick?: () => void
  isActive?: boolean
}

const SIDEBAR_MODEL_GROUPS: Array<{ title: string; models: string[] }> = [
  {
    title: "Operations",
    models: ["activity", "project", "impactmetric", "roadmapitem"],
  },
  {
    title: "Learn Hub",
    models: ["trivia", "story", "deepdivearticle", "knowledgeentry", "document", "docfolder"],
  },
  {
    title: "Social & Media",
    models: ["campaign", "teamquote", "subscriber", "partner", "program"],
  },
  {
    title: "Developer Tools",
    models: ["organization", "teammember", "organizationmember", "user", "auditlog", "changelog", "versioninfo", "gamificationprofile", "pointevent"],
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navMainItems?: SidebarNavItem[]
  orgItems?: SidebarNavItem[]
  governanceItems?: SidebarNavItem[]
  models?: Array<{ name: string; verbose_name: string }>
  activeModel?: string
  onModelSelect?: (name: string) => void
  user?: { name: string; email: string; avatar?: string }
}

export function AppSidebar({
  navMainItems,
  orgItems,
  governanceItems,
  models,
  activeModel,
  onModelSelect,
  user,
  ...props
}: AppSidebarProps) {
  const mainItems = navMainItems ?? defaultNavMain
  const userData = user ?? data.user

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
  })).filter((group) => group.items.length > 0)

  const groupedModelNames = new Set(SIDEBAR_MODEL_GROUPS.flatMap((group) => group.models))
  const uncategorizedModels = (models ?? [])
    .filter((model) => !groupedModelNames.has(model.name))
    .map((model) => ({
      title: model.verbose_name,
      url: "#",
      onClick: () => onModelSelect?.(model.name),
      isActive: activeModel === model.name,
    }))

  const groupChildren = (title: string) =>
    groupedByName.find((group) => group.title === title)?.items ?? []

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
  ].slice(0, MAX_PRIMARY_SIDEBAR_ITEMS)

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold text-primary">BNS Hub</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={compactSidebarItems.length > 0 ? compactSidebarItems : mainItems.slice(0, MAX_PRIMARY_SIDEBAR_ITEMS)} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar ?? "/avatars/admin.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
