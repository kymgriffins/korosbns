"use client";

import { useCallback, useEffect, useState } from "react";
import { KeyRound, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminProfileApi, adminSecurityApi, type SecurityInfoApi } from "@/lib/admin-api";

export default function SecurityPage() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<SecurityInfoApi | null>(null);
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  const fetchInfo = useCallback(async () => {
    setLoading(true);
    try {
      setInfo(await adminSecurityApi.getInfo());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load security info");
      setInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  async function handleChangePassword() {
    if (!passwords.current || !passwords.newPass) {
      toast.error("Current and new password are required");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.newPass.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      await adminProfileApi.changePassword(passwords.current, passwords.newPass);
      toast.success("Password changed successfully");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Security</h1>
        <p className="text-sm text-muted-foreground">Account password and platform security posture</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="size-4 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>Updates via POST /api/v1/auth/password/change/</CardDescription>
        </CardHeader>
        <CardContent className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Current Password</Label>
            <Input
              id="current"
              type="password"
              autoComplete="current-password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new">New Password</Label>
            <Input
              id="new"
              type="password"
              autoComplete="new-password"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              placeholder="At least 8 characters"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm New Password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </div>
          <Button onClick={handleChangePassword} disabled={saving}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Change Password
          </Button>
        </CardContent>
      </Card>

      {info ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last audit</CardDescription>
                <CardTitle className="text-lg">{info.last_audit_date}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Encryption</CardDescription>
                <CardTitle className="text-base leading-snug">{info.encryption}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Data retention</CardDescription>
                <CardTitle className="text-lg">{info.data_retention_days} days</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Backups</CardDescription>
                <CardTitle className="text-base leading-snug">{info.backup_frequency}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="size-4 text-primary" />
                Security Headers
              </CardTitle>
              <CardDescription>
                From <code className="text-xs">GET /api/v1/security/info/</code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Header</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(info.headers || {}).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-mono text-xs">{key}</TableCell>
                      <TableCell className="text-sm text-muted-foreground break-all">{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-4 text-sm text-muted-foreground">
                DPA status:{" "}
                <Badge variant="secondary" className="text-[10px]">
                  {info.dpa_status}
                </Badge>
              </p>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <p className="text-muted-foreground">Could not load security info</p>
            <Button variant="outline" onClick={fetchInfo}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
