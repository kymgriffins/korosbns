"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { NavBadge, NavGroup, NavMainItem, NavMainLinkItem, NavMainParentItem } from "@/navigation/sidebar/learn-items";

interface NavMainProps {
  readonly items: readonly NavGroup[];
  readonly getFullUrl: (url: string) => string;
}

function hasSubItems(item: NavMainItem): item is NavMainParentItem {
  return Boolean(item.subItems?.length);
}

export function NavMain({ items, getFullUrl }: NavMainProps) {
  const path = usePathname();

  const isItemActive = (item: NavMainItem) => {
    if (hasSubItems(item)) {
      return item.subItems.some((sub) => path.startsWith(sub.url));
    }
    return path === item.url || path.startsWith(item.url + "/");
  };

  const isSubItemActive = (url: string) => path === url;
  const isSubmenuOpen = (item: NavMainItem): boolean =>
    hasSubItems(item) && item.subItems.some((sub) => path.startsWith(sub.url));

  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.id}>
          {group.label && (
            <SidebarGroupLabel className="group-data-[collapsible=icon]:pointer-events-none">
              {group.label}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={isItemActive(item)}
                  isSubItemActive={isSubItemActive}
                  isSubmenuOpen={isSubmenuOpen(item)}
                  getFullUrl={getFullUrl}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}

function NavItem({
  item,
  isActive,
  isSubItemActive,
  isSubmenuOpen,
  getFullUrl,
}: {
  item: NavMainItem;
  isActive: boolean;
  isSubItemActive: (url: string) => boolean;
  isSubmenuOpen: boolean;
  getFullUrl: (url: string) => string;
}) {
  const { state, isMobile } = useSidebar();
  const isCollapsedDesktop = state === "collapsed" && !isMobile;

  if (!hasSubItems(item)) {
    return <NavLinkItem item={item} isActive={isActive} getFullUrl={getFullUrl} />;
  }

  if (isCollapsedDesktop) {
    return <NavDropdownItem item={item} isActive={isActive} isSubItemActive={isSubItemActive} getFullUrl={getFullUrl} />;
  }

  return (
    <NavCollapsibleItem
      item={item}
      isActive={isActive}
      defaultOpen={isSubmenuOpen}
      isSubItemActive={isSubItemActive}
      getFullUrl={getFullUrl}
    />
  );
}

function NavLinkItem({ item, isActive, getFullUrl }: { item: NavMainLinkItem; isActive: boolean; getFullUrl: (url: string) => string }) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild aria-disabled={item.disabled} tooltip={item.title} isActive={isActive}>
        <Link
          prefetch={false}
          href={getFullUrl(item.url)}
          target={item.newTab ? "_blank" : undefined}
          rel={item.newTab ? "noreferrer" : undefined}
        >
          {Icon && <Icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      <NavItemBadge badge={item.badge} />
    </SidebarMenuItem>
  );
}

function NavDropdownItem({
  item,
  isActive,
  isSubItemActive,
  getFullUrl,
}: {
  item: NavMainParentItem;
  isActive: boolean;
  isSubItemActive: (url: string) => boolean;
  getFullUrl: (url: string) => string;
}) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={isActive} disabled={item.disabled}>
            {Icon && <Icon />}
            <span>{item.title}</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={12} className="w-48">
          <DropdownMenuGroup>
            {item.subItems.map((subItem) => {
              const SubIcon = subItem.icon;
              return (
                <DropdownMenuItem key={subItem.id} asChild disabled={subItem.disabled}>
                  <Link
                    prefetch={false}
                    href={getFullUrl(subItem.url)}
                    target={subItem.newTab ? "_blank" : undefined}
                    rel={subItem.newTab ? "noreferrer" : undefined}
                    aria-current={isSubItemActive(subItem.url) ? "page" : undefined}
                    className="flex items-center gap-2"
                  >
                    {SubIcon && <SubIcon />}
                    <span>{subItem.title}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function NavCollapsibleItem({
  item,
  isActive,
  defaultOpen,
  isSubItemActive,
  getFullUrl,
}: {
  item: NavMainParentItem;
  isActive: boolean;
  defaultOpen: boolean;
  isSubItemActive: (url: string) => boolean;
  getFullUrl: (url: string) => string;
}) {
  const Icon = item.icon;

  return (
    <Collapsible asChild defaultOpen={defaultOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={isActive} disabled={item.disabled}>
            {Icon && <Icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <NavItemBadge badge={item.badge} />
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subItems.map((subItem) => {
              const SubIcon = subItem.icon;
              return (
                <SidebarMenuSubItem key={subItem.id}>
                  <SidebarMenuSubButton asChild aria-disabled={subItem.disabled} isActive={isSubItemActive(subItem.url)}>
                    <Link
                      prefetch={false}
                      href={getFullUrl(subItem.url)}
                      target={subItem.newTab ? "_blank" : undefined}
                      rel={subItem.newTab ? "noreferrer" : undefined}
                    >
                      {SubIcon && <SubIcon />}
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function NavItemBadge({ badge }: { badge?: NavBadge }) {
  if (!badge) return null;
  return (
    <SidebarMenuBadge
      className={cn(
        "rounded-sm border capitalize",
        badge === "new" && "border-green-600 text-green-600 peer-hover/menu-button:text-green-600 peer-data-active/menu-button:text-green-600",
        badge === "soon" && "border-muted-foreground text-muted-foreground",
      )}
    >
      {badge}
    </SidebarMenuBadge>
  );
}
