"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutDashboard } from "lucide-react";

import { useRouteBase, getFullUrl } from "@/lib/route-base";
import { useBreadcrumbTitle } from "./breadcrumb-title-context";

const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  task: "Tasks",
  "task-overview": "Overview",
  "task-report": "Report",
  profile: "Profile",
  privacy: "Privacy",
  security: "Security",
  users: "Users",
  roles: "Roles",
  content: "Content",
  modules: "Modules",
  authors: "Authors",
  "budget-data": "Budget Data",
  forum: "Forum",
  notes: "Notes",
  calendar: "Calendar",
  kanban: "Kanban",
  productivity: "Productivity",
  crm: "CRM",
  mail: "Mail",
  chat: "Chat",
  academy: "Academy",
  crud: "CRUD",
  new: "New Task",
  report: "Report",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function inferLabel(segment: string): string {
  return LABEL_MAP[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

function segmentLabel(segment: string, dynamicTitle: string | null, parentSegment?: string): string {
  if (UUID_RE.test(segment)) {
    return dynamicTitle ?? (parentSegment === "task" ? "Task" : "Detail");
  }
  return LABEL_MAP[segment] ?? inferLabel(segment);
}

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const routeBase = useRouteBase();
  const { title: dynamicTitle } = useBreadcrumbTitle() ?? { title: null };
  const segments = pathname.split("/").filter(Boolean);

  const dashboardIdx = segments.findIndex((s) => s === "dashboard");
  if (dashboardIdx === -1) return null;

  const crumbs = segments.slice(dashboardIdx);

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li className="inline-flex items-center gap-1.5">
          <Link href={getFullUrl(routeBase, "/dashboard")} className="transition-colors hover:text-foreground inline-flex items-center gap-1">
            <LayoutDashboard className="size-3.5" />
            Dashboard
          </Link>
        </li>
        {crumbs.slice(1).map((segment, idx) => {
          const href = routeBase + "/" + crumbs.slice(0, idx + 2).join("/");
          const isLast = idx === crumbs.length - 2;
          const parentSegment = idx > 0 ? crumbs[idx] : crumbs[0];
          const label = segmentLabel(segment, isLast ? dynamicTitle : null, parentSegment);
          return (
            <Fragment key={`${segment}-${idx}`}>
              <li role="presentation" aria-hidden="true" className="flex items-center">
                <ChevronRight className="size-3.5" />
              </li>
              <li className="inline-flex items-center gap-1.5 max-w-[min(100%,14rem)]">
                {isLast ? (
                  <span
                    role="link"
                    aria-disabled="true"
                    aria-current="page"
                    className="font-normal text-foreground truncate"
                    title={label}
                  >
                    {label}
                  </span>
                ) : (
                  <Link href={href} className="transition-colors hover:text-foreground truncate" title={label}>
                    {label}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
