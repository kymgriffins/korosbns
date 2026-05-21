"use client";

import Image from "next/image";
import Link from "next/link";
import { PageBreadcrumbs, type BreadcrumbItemConfig } from "@/components/global/page-breadcrumbs";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";

export function ContentLayout({
  title,
  description,
  breadcrumbs,
  children,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItemConfig[];
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const { user } = useAuth();
  const displayName =
    user?.display_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "Your account";

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <Link href={Routes.Home} className="flex items-center gap-2 shrink-0">
            <Image src="/logo.svg" alt="Budget Ndio Story" width={120} height={24} className="h-5 w-auto" />
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href={Routes.Articles} className="hidden sm:inline text-muted-foreground hover:text-foreground">
              Articles
            </Link>
            <Link href={Routes.Surveys} className="hidden sm:inline text-muted-foreground hover:text-foreground">
              Surveys
            </Link>
            <Link
              href={Routes.AccountNotifications}
              className="text-muted-foreground hover:text-foreground"
            >
              Notifications
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        <PageBreadcrumbs items={breadcrumbs} />

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt=""
                className="size-14 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Signed in as
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              {description ? (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              ) : null}
              {user?.email ? (
                <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
              ) : null}
            </div>
          </div>
          {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
        </div>

        {children}
      </div>
    </div>
  );
}
