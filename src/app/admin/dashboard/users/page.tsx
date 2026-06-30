"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { userData } from "@/data/users";
import type { AdminUser } from "@/lib/admin-api";

import { Users } from "./_components/users";
import type { UserRow } from "./_components/data";

function toUserRow(u: AdminUser): UserRow {
  return {
    email: u.email,
    joinedDate: new Date(u.date_joined).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    }),
    lastActive: u.last_login
      ? Math.round((Date.now() - new Date(u.last_login).getTime()) / 60000)
      : 999999,
    name: `${u.first_name} ${u.last_name}`.trim() || u.email,
    role: u.role === "admin" ? "Admin" : u.role === "editor" ? "Contributor" : "Read-only",
    status: u.is_active ? "Active" : "Deactivated",
    team: "Platform",
    workspace: ["BNS Platform"],
  };
}

export default function Page() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userData.admin.users.fetch({ page: 1 });
      setRows(res.results.map(toUserRow));
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <Users users={rows} />;
}
