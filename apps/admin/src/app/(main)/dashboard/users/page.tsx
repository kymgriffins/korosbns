"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, UserMinus, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/data-table";
import {
  adminUsersApi,
  INVITE_ROLE_OPTIONS,
  type AdminUser,
  type AdminUserStats,
} from "@/lib/admin-api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminUserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [listRes, statsRes] = await Promise.all([
        adminUsersApi.list({
          page,
          search: search || undefined,
          role: role === "all" ? undefined : role,
        }),
        adminUsersApi.stats().catch(() => null),
      ]);
      setUsers(listRes.results);
      setTotalPages(Math.max(1, Math.ceil((listRes.count ?? listRes.results.length) / 20)));
      setStats(statsRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const runAction = async (userId: string, action: () => Promise<unknown>, ok: string) => {
    setBusyId(userId);
    try {
      await action();
      toast.success(ok);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "Name",
      cell: (u) => (
        <div>
          <span className="font-medium">
            {u.display_name || `${u.first_name} ${u.last_name}`.trim() || u.email}
          </span>
          <span className="ml-2 text-sm text-muted-foreground">{u.email}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (u) => (
        <Select
          value={u.role_slug || ""}
          disabled={busyId === u.id}
          onValueChange={(slug) => {
            if (!slug || slug === u.role_slug) return;
            runAction(u.id, () => adminUsersApi.assignRole(u.id, slug), `Role updated to ${slug}`);
          }}
        >
          <SelectTrigger className="h-8 w-[130px]">
            <SelectValue placeholder={u.role || "Role"} />
          </SelectTrigger>
          <SelectContent>
            {INVITE_ROLE_OPTIONS.map((r) => (
              <SelectItem key={r.slug} value={r.slug}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      cell: (u) => (
        <div className="flex flex-wrap gap-1">
          <Badge variant={u.is_active ? "default" : "secondary"} className="text-[10px]">
            {u.is_active ? "User active" : "User inactive"}
          </Badge>
          {u.membership_is_active === false ? (
            <Badge variant="secondary" className="text-[10px]">
              Membership off
            </Badge>
          ) : null}
          {u.is_verified === false ? (
            <Badge variant="outline" className="text-[10px]">
              Unverified
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px]">
              Verified
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "date_joined",
      header: "Joined",
      cell: (u) => (
        <span className="text-sm text-muted-foreground">
          {new Date(u.date_joined).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (u) => (
        <div className="flex justify-end gap-1">
          {u.is_verified === false ? (
            <Button
              size="sm"
              variant="secondary"
              disabled={busyId === u.id}
              onClick={() => runAction(u.id, () => adminUsersApi.verify(u.id), "User verified")}
            >
              <ShieldCheck className="mr-1 size-3.5" />
              Verify
            </Button>
          ) : null}
          {u.membership_is_active !== false ? (
            <Button
              size="sm"
              variant="ghost"
              disabled={busyId === u.id}
              onClick={() => {
                if (!confirm(`Deactivate membership for ${u.email}?`)) return;
                runAction(u.id, () => adminUsersApi.deactivate(u.id), "Member deactivated");
              }}
            >
              <UserMinus className="mr-1 size-3.5" />
              Deactivate
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Organization members — assign roles, verify, or deactivate via Django JSON APIs.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/invitations">
            <UserPlus className="mr-1.5 size-4" />
            Invite Member
          </Link>
        </Button>
      </div>

      {stats && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">{stats.total_members}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active (30d)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">{stats.active_30d}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Joined (30d)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">{stats.recent_joined_30d}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">By role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(stats.role_distribution).length === 0 ? (
                  <span className="text-sm text-muted-foreground">—</span>
                ) : (
                  Object.entries(stats.role_distribution).map(([slug, count]) => (
                    <Badge key={slug} variant="outline" className="text-[10px] tabular-nums">
                      {slug}: {count}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <CardTitle>All Users</CardTitle>
          <Select
            value={role}
            onValueChange={(v) => {
              setRole(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {INVITE_ROLE_OPTIONS.map((r) => (
                <SelectItem key={r.slug} value={r.slug}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            loading={loading}
            error={error}
            searchable
            searchValue={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
