"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type BreadcrumbItemConfig = {
  label: string;
  href?: string;
};

const SEGMENT_NAME_MAP: Record<string, string> = {
  learn: "Learn",
  about: "About",
  budgetnews: "Budget News",
  events: "Events",
  faq: "FAQ",
  privacy: "Privacy Policy",
  reports: "Reports",
  security: "Security",
  team: "Team",
  terms: "Terms of Service",
  "weekly-notes": "Weekly Notes",
  "bns-project": "BNS Project",
  surveys: "Surveys",
  contact: "Contact",
  auth: "Auth",
  login: "Sign In",
  register: "Register",
  "forgot-password": "Forgot Password",
  reset: "Reset Password",
  verify: "Verify Email",
  admin: "Admin",
  dashboard: "Dashboard",
  academy: "Academy",
  authors: "Authors",
  kanban: "Kanban",
  modules: "Modules",
  forum: "Forum",
  profile: "Profile",
  quests: "Quests",
  paths: "Paths",
  articles: "Articles",
  stories: "Stories",
  videos: "Videos",
  repository: "Document Repository",
  account: "Account",
};

export function PageBreadcrumbs({
  items,
  className = "mb-6",
}: {
  items?: BreadcrumbItemConfig[];
  className?: string;
}) {
  const pathname = usePathname();

  // If on homepage, do not render breadcrumbs
  if (!pathname || pathname === "/") return null;

  let breadcrumbs: BreadcrumbItemConfig[] = [];

  if (items && items.length > 0) {
    breadcrumbs = items[0]?.href === "/" ? items : [{ label: "Home", href: "/" }, ...items];
  } else {
    // Generate automatically from pathname
    const segments = pathname.split("/").filter(Boolean);
    breadcrumbs = [{ label: "Home", href: "/" }];

    let currentPath = "";
    segments.forEach((segment, idx) => {
      currentPath += `/${segment}`;
      const formattedLabel =
        SEGMENT_NAME_MAP[segment] ||
        segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

      const isLast = idx === segments.length - 1;
      breadcrumbs.push({
        label: formattedLabel,
        href: isLast ? undefined : currentPath,
      });
    });
  }

  if (breadcrumbs.length <= 1) return null;

  return (
    <Breadcrumb className={className} aria-label="Breadcrumb navigation">
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
