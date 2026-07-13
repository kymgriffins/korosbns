"use client";

import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutDashboard } from "lucide-react";

import { useRouteBase, getFullUrl } from "@/lib/route-base";

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
  invitations: "Invitations",
  roles: "Roles",
  content: "Content",
  modules: "Modules",
  authors: "Authors",
  stories: "Stories",
  knowledge: "Knowledge",
  courses: "Courses",
  media: "Media",
  feedback: "Feedback",
  engagement: "Engagement",
  surveys: "Surveys",
  trivia: "Trivia",
  events: "Events",
  forum: "Forum",
  attempts: "Attempts",
  results: "Results",
  communication: "Communication",
  campaigns: "Campaigns",
  inbox: "Inbox",
  outbox: "Outbox",
  "contact-messages": "Contact Messages",
  "email-hooks": "Email Hooks",
  subscribers: "Subscribers",
  notifications: "Notifications",
  "audit-logs": "Audit Logs",
  docrepository: "Documents",
  "budget-data": "Budget Data",
  "ke-budget": "KE Budget",
  notes: "Notes",
  partners: "Partners",
  settings: "Settings",
  social: "Social",
  studio: "Studio",
  gamification: "Gamification",
  invoices: "Invoices",
  calendar: "Calendar",
  kanban: "Kanban",
  productivity: "Productivity",
  crm: "CRM",
  mail: "Mail",
  chat: "Chat",
  academy: "Academy",
  crud: "Manage",
  new: "New module",
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

type BreadcrumbTitleContextValue = {
  title: string | null;
  setTitle: (title: string | null) => void;
};

const BreadcrumbTitleContext = createContext<BreadcrumbTitleContextValue | null>(null);

export function BreadcrumbTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);
  const value = useMemo(() => ({ title, setTitle }), [title]);
  return (
    <BreadcrumbTitleContext.Provider value={value}>{children}</BreadcrumbTitleContext.Provider>
  );
}

export function useBreadcrumbTitle() {
  return useContext(BreadcrumbTitleContext);
}

/** Sets the layout breadcrumb label for the current page (e.g. task title). */
export function SetBreadcrumbTitle({ title }: { title: string }) {
  const ctx = useBreadcrumbTitle();
  useEffect(() => {
    ctx?.setTitle(title);
    return () => ctx?.setTitle(null);
  }, [ctx, title]);
  return null;
}

export function AdminPageBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();
  const routeBase = useRouteBase();
  const { title: dynamicTitle } = useBreadcrumbTitle() ?? { title: null };
  const segments = pathname.split("/").filter(Boolean);

  const dashboardIdx = segments.findIndex((s) => s === "dashboard");
  if (dashboardIdx === -1) return null;

  const crumbs = segments.slice(dashboardIdx);

  return (
    <nav aria-label="breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li className="inline-flex items-center gap-1.5">
          <Link
            href={getFullUrl(routeBase, "/dashboard")}
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
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
              <li className="inline-flex max-w-[min(100%,14rem)] items-center gap-1.5">
                {isLast ? (
                  <span
                    role="link"
                    aria-disabled="true"
                    aria-current="page"
                    className="truncate font-normal text-foreground"
                    title={label}
                  >
                    {label}
                  </span>
                ) : (
                  <Link href={href} className="truncate transition-colors hover:text-foreground" title={label}>
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
