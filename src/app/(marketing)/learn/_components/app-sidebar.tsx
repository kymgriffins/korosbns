"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouteBase, getFullUrl as _getFullUrl } from "@/lib/route-base";
import { learnSidebarItems } from "@/navigation/sidebar/learn-items";
import { NavMain } from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const getFullUrl = (url: string) => url;

  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link prefetch={false} href="/learn">
                <Image src="/logo.svg" alt="BNS" width={28} height={28} className="size-7 shrink-0" />
                <span className="font-semibold text-base">Learn Hub</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={learnSidebarItems} getFullUrl={getFullUrl} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
