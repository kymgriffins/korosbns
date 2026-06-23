"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import { adminUsersApi, type AdminUser } from "@/lib/admin-api";

// Modal mode
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
  const [form, setForm] = useState({ email: "", first_name: "", last_name: "", role: "viewer", is_active: true });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminUsersApi.list({ page, search: search || undefined });
      setUsers(res.results);
      setTotalPages(Math.max(1, Math.ceil(res.count / 25)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const resetForm = () => setForm({ email: "", first_name: "", last_name: "", role: "viewer", is_active: true });

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (user: AdminUser) => {
    setMode("edit");
    setEditId(user.id);
    setForm({ email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role, is_active: user.is_active });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.email || !form.first_name || !form.last_name) {
      toast.error("Email, first name, and last name are required");
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        await adminUsersApi.create(form);
        toast.success("User created");
      } else if (editId) {
        await adminUsersApi.update(editId, form);
        toast.success("User updated");
      }
      setDialogOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await adminUsersApi.delete(id);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const columns: Column<AdminUser>[] = [
    { key: "name", header: "Name", cell: (u) => `${u.first_name} ${u.last_name}` },
    { key: "email", header: "Email", cell: (u) => <span className="text-muted-foreground">{u.email}</span> },
    { key: "role", header: "Role", cell: (u) => <Badge variant="secondary" className="capitalize">{u.role}</Badge> },
    { key: "status", header: "Status", cell: (u) => u.is_active ? <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-0">Active</Badge> : <Badge variant="outline" className="text-muted-foreground">Inactive</Badge> },
    { key: "joined", header: "Joined", cell: (u) => <span className="text-sm text-muted-foreground">{new Date(u.date_joined).toLocaleDateString()}</span> },
    { key: "actions", header: "", className: "w-24", cell: (u) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(u)}><Pencil className="size-3.5" /></Button>
        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(u.id)} className="text-destructive hover:text-destructive"><Trash2 className="size-3.5" /></Button>
      </div>
    )},
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">Manage platform users</p>
      </div>
      <Card>
        <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            loading={loading}
            error={error}
            searchable
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            onCreate={openCreate}
            createLabel="Add User"
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={mode === "create" ? "Create User" : "Edit User"} onSubmit={handleSubmit} loading={saving}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} id="is_active" />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </FormDialog>
    </div>
  );
}
