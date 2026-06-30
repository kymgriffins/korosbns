"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import type { AdminRole } from "@/lib/admin-api";
import { userData } from "@/data/users";

type Mode = "create" | "edit";

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await userData.admin.roles.fetch();
      setRoles(res.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const resetForm = () => setForm({ name: "", description: "" });

  const openCreate = () => { setMode("create"); setEditId(null); resetForm(); setDialogOpen(true); };

  const openEdit = (role: AdminRole) => {
    setMode("edit"); setEditId(role.id);
    setForm({ name: role.name, description: role.description ?? "" });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      if (mode === "create") { await userData.admin.roles.create(form); toast.success("Role created"); }
      else if (editId) { await userData.admin.roles.update(editId, form); toast.success("Role updated"); }
      setDialogOpen(false); fetchRoles();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Operation failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this role?")) return;
    try { await userData.admin.roles.delete(id); toast.success("Role deleted"); fetchRoles(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Delete failed"); }
  };

  const columns: Column<AdminRole>[] = [
    { key: "name", header: "Name", cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "description", header: "Description", cell: (r) => <span className="text-muted-foreground text-sm">{r.description || "—"}</span> },
    { key: "permissions", header: "Permissions", cell: (r) => (
      <div className="flex flex-wrap gap-1">{r.permissions.slice(0, 3).map((p) => <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>)}{r.permissions.length > 3 && <span className="text-xs text-muted-foreground">+{r.permissions.length - 3}</span>}</div>
    )},
    { key: "users", header: "Users", cell: (r) => <span className="tabular-nums">{r.user_count}</span> },
    { key: "actions", header: "", className: "w-24", cell: (r) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(r)}><Pencil className="size-3.5" /></Button>
        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(r.id)} className="text-destructive hover:text-destructive"><Trash2 className="size-3.5" /></Button>
      </div>
    )},
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Roles</h1><p className="text-sm text-muted-foreground">Manage user roles and permissions</p></div>
      <Card><CardHeader><CardTitle>All Roles</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={roles} loading={loading} error={error} onCreate={openCreate} createLabel="Add Role" />
        </CardContent>
      </Card>
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={mode === "create" ? "Create Role" : "Edit Role"} onSubmit={handleSubmit} loading={saving}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Editor" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
        </div>
      </FormDialog>
    </div>
  );
}
