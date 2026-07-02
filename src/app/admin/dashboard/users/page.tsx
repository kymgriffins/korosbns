"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { userData } from "@/data/users";
import type { AdminUser } from "@/lib/admin-api";
import { PageInfo } from "@/components/admin/page-info";

import { Users } from "./_components/users";
import type { UserRow } from "./_components/data";

function toRelativeMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("/")) return url;
  return url.replace(/^https?:\/\/[^/]+/, "") ?? "";
}

const ALL_ROLES = [
  "admin", "editor", "viewer",
  "superadmin", "moderator", "contributor", "manager",
];

type FormState = {
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  role: string;
  is_active: boolean;
};

const EMPTY_FORM: FormState = {
  email: "", first_name: "", last_name: "", display_name: "", role: "viewer", is_active: true,
};

function toUserRow(u: AdminUser): UserRow {
  return {
    id: u.id,
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
    avatar: toRelativeMediaUrl(u.avatar),
  };
}

export default function Page() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [usersMap, setUsersMap] = useState<Map<string, AdminUser>>(new Map());
  const [loading, setLoading] = useState(true);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userData.admin.users.fetch({ page: 1 });
      const map = new Map<string, AdminUser>();
      const mapped = res.results.map((u) => {
        map.set(u.id, u);
        return toUserRow(u);
      });
      setUsersMap(map);
      setRows(mapped);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openCreate = () => {
    setEditMode("create");
    setEditId(null);
    setForm(EMPTY_FORM);
    setEditOpen(true);
  };

  const openEdit = (user: UserRow) => {
    const admin = usersMap.get(user.id ?? "");
    if (!admin) { toast.error("User data not found"); return; }
    setEditMode("edit");
    setEditId(admin.id);
    setForm({
      email: admin.email,
      first_name: admin.first_name,
      last_name: admin.last_name,
      display_name: admin.display_name ?? "",
      role: admin.role,
      is_active: admin.is_active,
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!form.email || !form.first_name || !form.last_name) {
      toast.error("Email, first name, and last name are required");
      return;
    }
    setSaving(true);
    try {
      if (editMode === "create") {
        await userData.admin.users.create(form);
        toast.success("User created");
      } else if (editId) {
        await userData.admin.users.update(editId, form);
        toast.success("User updated");
      }
      setEditOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await userData.admin.users.update(deleteTarget.id, {
        is_active: deleteTarget.status !== "Deactivated",
      });
      toast.success(deleteTarget.status === "Deactivated" ? "User activated" : "User deactivated");
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const deleteLabel = deleteTarget?.status === "Deactivated" ? "Activate" : "Deactivate";

  return (
    <>
      <Users users={rows} onEdit={openEdit} onDelete={(u) => setDeleteTarget(u)} onAdd={openCreate} />

      {/* Create / Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editMode === "create" ? "Add User" : "Edit User"}</DialogTitle>
            <DialogDescription>
              {editMode === "create" ? "Create a new user account." : "Update user details, role, or status."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-first">First Name</Label>
                <Input id="edit-first" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-last">Last Name</Label>
                <Input id="edit-last" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger id="edit-role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} id="edit-active" />
              <Label htmlFor="edit-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editMode === "create" ? "Create" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete / Deactivate Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteLabel} User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {deleteLabel?.toLowerCase()} <strong>{deleteTarget?.name}</strong>?
              {deleteTarget?.status !== "Deactivated" ? " They will lose access to the platform." : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className={deleteLabel === "Deactivate" ? "bg-destructive hover:bg-destructive/90" : ""}>
              {deleting ? "..." : <><Trash2 className="mr-1 size-3.5" />{deleteLabel}</>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
