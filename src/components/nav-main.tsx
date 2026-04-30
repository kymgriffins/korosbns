"use client"

import * as React from "react"
import { IconChevronRight, IconCirclePlusFilled, type Icon as IconType } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/utils/index"
import { motion, AnimatePresence } from "motion/react"

export type NavItem = {
  title: string
  url?: string
  icon?: IconType
  onClick?: () => void
  isActive?: boolean
  badge?: string | number
  children?: NavItem[]
  disabled?: boolean
}

interface NavMainProps {
  items: NavItem[]
  title?: string
  showQuickActions?: boolean
  className?: string
}

export function NavMain({
  items,
  title,
  showQuickActions = false,
  className,
}: NavMainProps) {
  const pathname = usePathname()
  const initialOpen = React.useMemo(
    () => items.find((item) => item.children?.length && (item.isActive || item.children?.some((child) => child.isActive)))?.title ?? null,
    [items]
  )
  const [openRootTitle, setOpenRootTitle] = React.useState<string | null>(initialOpen)

  React.useEffect(() => {
    if (!openRootTitle) {
      const next = items.find((item) => item.children?.length && (item.isActive || item.children?.some((child) => child.isActive)))?.title ?? null
      if (next) setOpenRootTitle(next)
    }
  }, [items, openRootTitle])

  return (
    <SidebarGroup className={cn("py-1", className)}>
      {title ? (
        <div className="px-2 py-1.5 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
          {title}
        </div>
      ) : null}
      <SidebarGroupContent className="flex flex-col gap-0.5">
        {showQuickActions ? (
          <SidebarMenu className="py-1">
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground shadow-sm"
              >
                <IconCirclePlusFilled className="size-4" />
                <span>Quick Create</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : null}
        <ScrollArea className="h-auto max-h-[calc(100vh-200px)]">
          <SidebarMenu className="gap-0.5">
            {items.map((item, index) => (
              <NavMenuItem
                key={`${item.title}-${index}`}
                item={item}
                pathname={pathname}
                depth={0}
                openRootTitle={openRootTitle}
                setOpenRootTitle={setOpenRootTitle}
              />
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

interface NavMenuItemProps {
  item: NavItem
  pathname: string
  depth: number
  openRootTitle?: string | null
  setOpenRootTitle?: (title: string | null) => void
}

function NavMenuItem({ item, pathname, depth, openRootTitle, setOpenRootTitle }: NavMenuItemProps) {
  const [isOpen, setIsOpen] = React.useState(item.isActive ?? false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = item.isActive || (item.url && pathname.startsWith(item.url))

  React.useEffect(() => {
    if (depth !== 0 || !hasChildren) return
    if (openRootTitle == null) return
    setIsOpen(openRootTitle === item.title)
  }, [depth, hasChildren, item.title, openRootTitle])

  const handleClick = () => {
    if (hasChildren) {
      if (depth === 0) {
        setOpenRootTitle?.(item.title)
      } else {
        setIsOpen(true)
      }
    }
    item.onClick?.()
  }

  const IconComponent = item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        onClick={handleClick}
        isActive={isActive as boolean}
        disabled={item.disabled}
        className={cn(
          "group relative transition-all duration-200",
          hasChildren && "pr-8",
          depth > 0 && "ml-2 border-l-2 border-sidebar-border pl-3"
        )}
      >
        {IconComponent && (
          <IconComponent className="size-4 shrink-0 text-sidebar-foreground/70" />
        )}
        <span className="truncate font-medium">{item.title}</span>
        {item.badge && (
          <span className="ml-auto size-5 min-w-5 rounded-full bg-primary/10 px-1 text-xs font-medium text-primary flex items-center justify-center">
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <IconChevronRight className="size-3 text-muted-foreground" />
            </motion.div>
          </span>
        )}
      </SidebarMenuButton>

      {/* Nested Submenu */}
      {hasChildren && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <SidebarMenuSub>
                {item.children!.map((child, idx) => (
                  <SidebarMenuSubItem key={`${child.title}-${idx}`}>
                    <SidebarMenuSubButton
                      asChild={!!child.url && !child.onClick}
                      isActive={child.isActive}
                      className="text-xs"
                    >
                      {child.onClick ? (
                        <button
                          type="button"
                          onClick={() => {
                            child.onClick?.()
                          }}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                          {child.icon && (
                            <child.icon className="size-3.5 shrink-0" />
                          )}
                          <span className="truncate">{child.title}</span>
                          {child.badge && (
                            <span className="ml-auto size-4 min-w-4 rounded-full bg-muted px-1 text-[10px] font-medium">
                              {child.badge}
                            </span>
                          )}
                        </button>
                      ) : child.url ? (
                        <Link href={child.url}>
                          {child.icon && (
                            <child.icon className="size-3.5 shrink-0" />
                          )}
                          <span className="truncate">{child.title}</span>
                          {child.badge && (
                            <span className="ml-auto size-4 min-w-4 rounded-full bg-muted px-1 text-[10px] font-medium">
                              {child.badge}
                            </span>
                          )}
                        </Link>
                      ) : null}
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </SidebarMenuItem>
  )
}
