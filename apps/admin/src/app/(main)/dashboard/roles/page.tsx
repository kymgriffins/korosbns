"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminRolesApi,
  normalizeListResponse,
  type AdminRole,
} from "@/lib/admin-api";

type Mode = "create" | "edit";

const emptyForm = () => ({
  name: "",
  slug: "",
  description: "",
  priority: "1",
});

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminRolesApi.list();
      setRoles(normalizeListResponse(res).results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (role: AdminRole) => {
    setMode("edit");
    setEditId(role.id);
    setForm({
      name: role.name,
      slug: role.slug || "",
      description: role.description ?? "",
      priority: String(role.priority ?? 1),
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description.trim(),
        priority: Number(form.priority) || 1,
      };
      if (mode === "create") {
        await adminRolesApi.create(payload);
        toast.success("Role created");
      } else if (editId) {
        await adminRolesApi.update(editId, payload);
        toast.success("Role updated");
      }
      setDialogOpen(false);
      fetchRoles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role: AdminRole) => {
    if (role.is_builtin) {
      toast.error("Built-in roles cannot be deleted");
      return;
    }
    if (!confirm(`Delete role "${role.name}"?`)) return;
    try {
      await adminRolesApi.delete(role.id);
      toast.success("Role deleted");
      fetchRoles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const columns: Column<AdminRole>[] = [
    {
      key: "name",
      header: "Name",
      cell: (r) => (
        <div className="space-y-0.5">
          <span className="font-medium">{r.name}</span>
          {r.slug ? <p className="text-xs text-muted-foreground">{r.slug}</p> : null}
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      cell: (r) => (
        <span className="text-sm text-muted-foreground">{r.description || "—"}</span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      cell: (r) => <span className="tabular-nums">{r.priority ?? "—"}</span>,
    },
    {
      key: "permissions",
      header: "Permissions",
      cell: (r) => (
        <div className="flex flex-wrap gap-1">
          {(r.permissions ?? []).slice(0, 3).map((p) => (
            <Badge key={p} variant="outline" className="text-[10px]">
              {p}
            </Badge>
          ))}
          {(r.permissions?.length ?? 0) > 3 && (
            <span className="text-xs text-muted-foreground">+{r.permissions.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: "users",
      header: "Users",
      cell: (r) => <span className="tabular-nums">{r.user_count}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      cell: (r) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(r)}>
            <Pencil className="size-3.5" />
          </Button>
          {!r.is_builtin && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleDelete(r)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
        <p className="text-sm text-muted-foreground">
          Manage business roles, priority, and Django group permissions.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={roles}
            loading={loading}
            error={error}
            onCreate={openCreate}
            createLabel="Add Role"
            onRefresh={fetchRoles}
            emptyMessage="No roles found."
          />
        </CardContent>
      </Card>
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create Role" : "Edit Role"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="space-y-2">
          <Label htmlFor="role-name">Name</Label>
          <Input
            id="role-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Editor"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="role-slug">Slug</Label>
            <Input
              id="role-slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="auto from name"
              disabled={mode === "edit"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role-priority">Priority</Label>
            <Input
              id="role-priority"
              type="number"
              min={0}
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="role-description">Description</Label>
          <Textarea
            id="role-description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>
      </FormDialog>
    </div>
  );
}
