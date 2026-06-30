"use client"

import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useRouteBase } from "@/lib/route-base"

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  task: "Tasks",
  report: "Report",
  new: "New Task",
}

interface Crumb {
  label: string
  href?: string
}

export function AdminTaskBreadcrumbs({ segments }: { segments?: string[] }) {
  const routeBase = useRouteBase()

  const crumbs: Crumb[] = [
    { label: "Dashboard", href: `${routeBase}/admin/dashboard` },
    { label: "Tasks", href: `${routeBase}/admin/dashboard/task` },
  ]

  if (segments) {
    for (const seg of segments) {
      const label = SEGMENT_LABELS[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      crumbs.push({ label })
    }
  }

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <BreadcrumbItem key={i}>
            {i < crumbs.length - 1 && crumb.href ? (
              <>
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
