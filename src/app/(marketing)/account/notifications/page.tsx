"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { Protected } from "@/components/citizen/protected";
import { Routes } from "@/constants/routes";
import { citizenApi } from "@/lib/api-client";

function NotificationsList() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void citizenApi
      .getNotifications()
      .then((d) => setItems(d.results || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Wrapper className="py-16">
      <div className="max-w-xl mx-auto">
        <Link
          href={Routes.Account}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <ArrowLeft className="size-4" />
          Account
        </Link>
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>
        {loading && <Loader2 className="size-8 animate-spin" />}
        {!loading && items.length === 0 && (
          <p className="text-muted-foreground text-sm">No notifications in your queue.</p>
        )}
        <ul className="space-y-3">
          {items.map((n) => (
            <li key={String(n.id)} className="rounded-lg border border-border p-4 text-sm">
              <span className="font-medium">{String(n.trigger_type || "update")}</span>
              <span className="text-muted-foreground ml-2">{String(n.status || "")}</span>
              {n.created_at ? (
                <p className="text-xs text-muted-foreground mt-1">{String(n.created_at)}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
}

export default function NotificationsPage() {
  return (
    <Protected>
      <NotificationsList />
    </Protected>
  );
}
