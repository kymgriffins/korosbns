"use client";


import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ContentLayout } from "@/layouts/DashboardShell";
import { Skeleton } from "@/ui/skeleton";
import { Routes } from "@/constants/routes";
import { useNotifications } from "@/hooks/use-profile";

function NotificationsList() {
  const { data, isLoading } = useNotifications();

  const items = (data?.results || []) as Record<string, unknown>[];
  const loading = isLoading;

  return (
    <ContentLayout
      title="Notifications"
      description="Your engagement and account updates."
      breadcrumbs={[
        { label: "Home", href: Routes.Home },
        { label: "Account", href: Routes.Account },
        { label: "Notifications" },
      ]}
    >
      {loading ? (
        <div className="space-y-3" aria-busy="true">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Loader2 className="mx-auto size-6 animate-spin text-primary" />
        </div>
      ) : null}
      {!loading && items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notifications in your queue.</p>
      ) : null}
      <ul className="space-y-3">
        {items.map((n) => (
          <li key={String(n.id)} className="rounded-lg border border-border p-4 text-sm">
            <span className="font-medium">{String(n.trigger_type || "update")}</span>
            <span className="ml-2 text-muted-foreground">{String(n.status || "")}</span>
            {n.created_at ? (
              <p className="mt-1 text-xs text-muted-foreground">{String(n.created_at)}</p>
            ) : null}
          </li>
        ))}
      </ul>
      <Link href={Routes.Account} className="mt-8 inline-block text-sm text-primary hover:underline">
        ← Back to account
      </Link>
    </ContentLayout>
  );
}

export default function NotificationsPage() {
  return <NotificationsList />;
}
