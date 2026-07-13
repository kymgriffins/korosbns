"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminPrivacyApi, type PrivacyConfigApi } from "@/lib/admin-api";

export default function PrivacyPage() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<PrivacyConfigApi | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      setConfig(await adminPrivacyApi.getConfig());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load privacy config");
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  if (loading) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="@container/main flex flex-col items-center gap-4 py-20">
        <p className="text-muted-foreground">Failed to load privacy configuration</p>
        <Button variant="outline" onClick={fetchConfig}>
          Retry
        </Button>
      </div>
    );
  }

  const rows = [
    {
      area: "Data collection purpose",
      status: "Active",
      details: config.data_collection_purpose,
    },
    {
      area: "GDPR compliance",
      status: config.gdpr_compliant ? "Compliant" : "Review needed",
      details: config.gdpr_compliant ? "Marked GDPR compliant" : "Not marked compliant",
    },
    {
      area: "Data retention",
      status: "Active",
      details: `${config.data_retention_days} days`,
    },
    {
      area: "Third-party sharing",
      status: config.third_party_sharing ? "Enabled" : "Disabled",
      details: config.third_party_sharing
        ? "Third-party sharing is enabled"
        : "No third-party sharing by default",
    },
    {
      area: "Last updated",
      status: "—",
      details: config.last_updated,
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Data Privacy</h1>
        <p className="text-sm text-muted-foreground">Privacy configuration and compliance summary</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4 text-primary" />
            Privacy Policy Overview
          </CardTitle>
          <CardDescription>
            Values from <code className="text-xs">GET /api/v1/privacy/config/</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.area}>
                  <TableCell className="font-medium">{row.area}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={config.privacy_policy_url} target="_blank" rel="noreferrer">
                Privacy policy
                <ExternalLink className="ml-1.5 size-3.5" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={config.cookie_policy_url} target="_blank" rel="noreferrer">
                Cookie policy
                <ExternalLink className="ml-1.5 size-3.5" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact DPO</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Data Protection Officer:{" "}
            <a className="font-medium text-foreground underline" href={`mailto:${config.dpa_contact}`}>
              {config.dpa_contact}
            </a>
            <br />
            For privacy-related inquiries, data access requests, or deletion requests.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
