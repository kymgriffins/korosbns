"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { userData } from "@/data/users";
import type { AdminRole } from "@/lib/admin-api";

import { Roles } from "./_components/roles";
import type { Role as RoleRow } from "./_components/roles-table/data";

function toRoleRow(r: AdminRole): RoleRow {
  return {
    role: r.name,
    group: "Custom roles",
    accessLevel: r.permissions.length > 5 ? "Full" : r.permissions.length > 2 ? "Scoped" : "Read only",
    users: r.user_count,
    permissionSets: r.permissions.slice(0, 5),
    lastReview: new Date(r.created_at).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    }),
    owner: "System",
    status: "Active",
  };
}

export default function Page() {
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userData.admin.roles.fetch();
      setRows(res.results.map(toRoleRow));
    } catch {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <Roles roles={rows} />;
}
