"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, Forward, Inbox, Mail, Phone, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminCampaignsApi, adminContactMessagesApi, adminInboxApi, adminOutboxApi } from "@/lib/admin-api";

export default function CommunicationDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [campaignCount, setCampaignCount] = useState(0);
  const [inboxUnread, setInboxUnread] = useState(0);
  const [outboxPending, setOutboxPending] = useState(0);
  const [contactNew, setContactNew] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [campaignsRes, inboxRes, outboxRes, contactsRes] = await Promise.all([
        adminCampaignsApi.list(),
        adminInboxApi.list({ is_read: false }),
        adminOutboxApi.list({ status: "pending" }),
        adminContactMessagesApi.list({ status: "NEW" }),
      ]);
      setCampaignCount(campaignsRes.count);
      setInboxUnread(inboxRes.count);
      setOutboxPending(outboxRes.count);
      setContactNew(contactsRes.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load communication data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const kpis = [
    { label: "Campaigns", value: campaignCount, icon: Send, href: "/dashboard/communication/campaigns" },
    { label: "Unread Inbox", value: inboxUnread, icon: Inbox, href: "/dashboard/communication/inbox" },
    { label: "Pending Outbox", value: outboxPending, icon: Forward, href: "/dashboard/communication/outbox" },
    { label: "New Messages", value: contactNew, icon: Phone, href: "/dashboard/communication/contact-messages" },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Communication Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of newsletter campaigns, inbox, outbox, and contact messages.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <a key={kpi.label} href={kpi.href} className="block">
            <Card className="transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                <kpi.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <span className="text-muted-foreground">...</span>
                  ) : (
                    kpi.value
                  )}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
        <div className="flex flex-col items-center gap-2 text-center">
          <BarChart3 className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Select a section from the sidebar or click a KPI card above.
          </p>
        </div>
      </div>
    </div>
  );
}
