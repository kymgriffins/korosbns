"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, Forward, Inbox, Phone, Send, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  adminCampaignsApi,
  adminContactMessagesApi,
  adminInboxApi,
  adminOutboxApi,
  adminSubscribersApi,
} from "@/lib/admin-api";

export default function CommunicationDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [campaignCount, setCampaignCount] = useState(0);
  const [inboxUnread, setInboxUnread] = useState(0);
  const [outboxPending, setOutboxPending] = useState(0);
  const [contactNew, setContactNew] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    const settled = await Promise.allSettled([
      adminCampaignsApi.list(),
      adminInboxApi.list({ is_read: false }),
      adminOutboxApi.list({ status: "pending" }),
      adminContactMessagesApi.list({ status: "NEW" }),
      adminSubscribersApi.list({ active_only: true }),
    ]);

    const [campaignsRes, inboxRes, outboxRes, contactsRes, subscribersRes] = settled;
    const failures: string[] = [];

    if (campaignsRes.status === "fulfilled") setCampaignCount(campaignsRes.value.count ?? 0);
    else failures.push("campaigns");
    if (inboxRes.status === "fulfilled") setInboxUnread(inboxRes.value.count ?? 0);
    else failures.push("inbox");
    if (outboxRes.status === "fulfilled") setOutboxPending(outboxRes.value.count ?? 0);
    else failures.push("outbox");
    if (contactsRes.status === "fulfilled") setContactNew(contactsRes.value.count ?? 0);
    else failures.push("contacts");
    if (subscribersRes.status === "fulfilled") setSubscriberCount(subscribersRes.value.count ?? 0);
    else failures.push("subscribers");

    if (failures.length === settled.length) {
      setError("Failed to load communication data. Check auth and API availability.");
    } else if (failures.length > 0) {
      setError(`Partial load — could not fetch: ${failures.join(", ")}.`);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kpis = [
    { label: "Campaigns", value: campaignCount, icon: Send, href: "/dashboard/communication/campaigns" },
    { label: "Unread Inbox", value: inboxUnread, icon: Inbox, href: "/dashboard/communication/inbox" },
    { label: "Pending Outbox", value: outboxPending, icon: Forward, href: "/dashboard/communication/outbox" },
    { label: "New Messages", value: contactNew, icon: Phone, href: "/dashboard/communication/contact-messages" },
    { label: "Subscribers", value: subscriberCount, icon: Users, href: "/dashboard/communication/subscribers" },
    { label: "Notifications", value: "→", icon: Bell, href: "/dashboard/communication/notifications" },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Communication Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of newsletter campaigns, inbox, outbox, contacts, and subscribers.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <a key={kpi.label} href={kpi.href} className="block">
            <Card className="transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                <kpi.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <span className="text-muted-foreground">...</span> : kpi.value}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
