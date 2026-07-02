"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import { adminUsersApi, type AdminUser } from "@/lib/admin-api";

type Mode = "create" | "edit";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ email: "", first_name: "", last_name: "" });

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await adminUsersApi.list({ page, search: search || undefined });
      setUsers(res.results);
      setTotalPages(Math.max(1, Math.ceil(res.count / 20)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const resetForm = () => setForm({ email: "", first_name: "", last_name: "" });

  const openCreate = () => { setMode("create"); setEditId(null); resetForm(); setDialogOpen(true); };

  const openEdit = (u: AdminUser) => {
    setMode("edit"); setEditId(u.id);
    setForm({ email: u.email, first_name: u.first_name, last_name: u.last_name });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.email) { toast.error("Email is required"); return; }
    setSaving(true);
    try {
      if (mode === "create") { await adminUsersApi.create(form); toast.success("User created"); }
      else if (editId) { await adminUsersApi.update(editId, form); toast.success("User updated"); }
      setDialogOpen(false); fetchUsers();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Operation failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this user from the organization?")) return;
    try { await adminUsersApi.delete(id); toast.success("User removed"); fetchUsers(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Delete failed"); }
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "name", header: "Name", cell: (u) => (
        <div>
          <span className="font-medium">{u.display_name || `${u.first_name} ${u.last_name}`.trim() || u.email}</span>
          <span className="ml-2 text-sm text-muted-foreground">{u.email}</span>
        </div>
      ),
    },
    { key: "role", header: "Role", cell: (u) => <Badge variant="secondary" className="text-[10px]">{u.role || "—"}</Badge> },
    {
      key: "is_active", header: "Status", cell: (u) => (
        <Badge variant={u.is_active ? "default" : "secondary"} className="text-[10px]">{u.is_active ? "Active" : "Inactive"}</Badge>
      ),
    },
    { key: "date_joined", header: "Joined", cell: (u) => <span className="text-sm text-muted-foreground">{new Date(u.date_joined).toLocaleDateString()}</span> },
    { key: "last_login", header: "Last Login", cell: (u) => <span className="text-sm text-muted-foreground">{u.last_login ? new Date(u.last_login).toLocaleDateString() : "—"}</span> },
    { key: "actions", header: "", className: "w-24", cell: (u) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(u)}><Pencil className="size-3.5" /></Button>
        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(u.id)} className="text-destructive hover:text-destructive"><Trash2 className="size-3.5" /></Button>
      </div>
    )},
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Users</h1><p className="text-sm text-muted-foreground">Manage organization members</p></div>
      <Card><CardHeader><CardTitle>All Users</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users} loading={loading} error={error}
            searchable searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
            onCreate={openCreate} createLabel="Add User"
            page={page} totalPages={totalPages} onPageChange={setPage} />
        </CardContent>
      </Card>
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={mode === "create" ? "Add User" : "Edit User"} onSubmit={handleSubmit} loading={saving}>
        <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>First Name</Label><Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="Jane" /></div>
          <div className="space-y-2"><Label>Last Name</Label><Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Doe" /></div>
        </div>
      </FormDialog>
    </div>
  );
}
