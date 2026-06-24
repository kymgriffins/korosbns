"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutDashboard } from "lucide-react";

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
  new: "New",
  report: "Report",
};

function inferLabel(segment: string): string {
  return LABEL_MAP[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const dashboardIdx = segments.findIndex((s) => s === "dashboard");
  if (dashboardIdx === -1) return null;

  const crumbs = segments.slice(dashboardIdx);

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li className="inline-flex items-center gap-1.5">
          <Link href="/dashboard" className="transition-colors hover:text-foreground inline-flex items-center gap-1">
            <LayoutDashboard className="size-3.5" />
            Dashboard
          </Link>
        </li>
        {crumbs.slice(1).map((segment, idx) => {
          const href = "/" + crumbs.slice(0, idx + 2).join("/");
          const isLast = idx === crumbs.length - 2;
          return (
            <Fragment key={segment}>
              <li role="presentation" aria-hidden="true" className="flex items-center">
                <ChevronRight className="size-3.5" />
              </li>
              <li className="inline-flex items-center gap-1.5">
                {isLast ? (
                  <span role="link" aria-disabled="true" aria-current="page" className="font-normal text-foreground">
                    {inferLabel(segment)}
                  </span>
                ) : (
                  <Link href={href} className="transition-colors hover:text-foreground">
                    {inferLabel(segment)}
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
