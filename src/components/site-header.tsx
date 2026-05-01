import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

interface SiteHeaderProps {
  title?: string
  subtitle?: string
  roleLabel?: string
  orgLabel?: string
}

export function SiteHeader({ title = "Admin Hub", subtitle, roleLabel, orgLabel }: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border/30 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex flex-col">
          <h1 className="text-base font-medium">{title}</h1>
          {subtitle ? (
            <span className="text-xs text-muted-foreground hidden sm:inline">{subtitle}</span>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {orgLabel ? <Badge variant="secondary" className="hidden md:inline-flex">{orgLabel}</Badge> : null}
          {roleLabel ? <Badge variant="outline" className="hidden md:inline-flex">{roleLabel}</Badge> : null}
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="/"
              rel="noopener noreferrer"
              className="dark:text-foreground"
            >
              Back to site
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
