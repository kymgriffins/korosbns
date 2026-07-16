"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Lock,
  Pencil,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminRolesApi,
  type AdminPermission,
  type AdminRole,
} from "@/lib/admin-api";

type Mode = "create" | "edit";

const emptyForm = () => ({
  name: "",
  slug: "",
  description: "",
  priority: "1",
  permission_ids: [] as number[],
});

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [rolesRes, permsRes] = await Promise.all([
        adminRolesApi.list(),
        adminRolesApi.permissions(),
      ]);
      setRoles(rolesRes.results ?? []);
      setPermissions(permsRes ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const filteredRoles = useMemo(() => {
    let list = roles;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.slug?.toLowerCase().includes(q),
      );
    }
    if (typeFilter === "system") list = list.filter((r) => r.is_builtin);
    else if (typeFilter === "custom") list = list.filter((r) => !r.is_builtin);
    return list;
  }, [roles, search, typeFilter]);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, AdminPermission[]> = {};
    for (const p of permissions) {
      const key = p.app_label || "Other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [permissions]);

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
      permission_ids: role.permission_ids ?? [],
    });
    setDialogOpen(true);
  };

  const togglePermission = (permId: number) => {
    setForm((prev) => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permId)
        ? prev.permission_ids.filter((id) => id !== permId)
        : [...prev.permission_ids, permId],
    }));
  };

  const selectAllInGroup = (groupPerms: AdminPermission[], select: boolean) => {
    const groupIds = groupPerms.map((p) => p.id);
    setForm((prev) => ({
      ...prev,
      permission_ids: select
        ? [...new Set([...prev.permission_ids, ...groupIds])]
        : prev.permission_ids.filter((id) => !groupIds.includes(id)),
    }));
  };

  const allInGroupSelected = (groupPerms: AdminPermission[]) =>
    groupPerms.every((p) => form.permission_ids.includes(p.id));

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
        permission_ids: form.permission_ids,
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
    if (!confirm(`Delete role "${role.name}"? This cannot be undone.`)) return;
    try {
      await adminRolesApi.delete(role.id);
      toast.success(`Role "${role.name}" deleted`);
      fetchRoles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const systemRoles = roles.filter((r) => r.is_builtin).length;
  const customRoles = roles.filter((r) => !r.is_builtin).length;

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">
            Manage access roles, permissions, and user assignments.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus data-icon="inline-start" />
          Create Role
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Shield className="size-4 text-muted-foreground" />
              Total Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {loading ? "…" : roles.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Lock className="size-4 text-muted-foreground" />
              System Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums text-muted-foreground">
              {loading ? "…" : systemRoles}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Users className="size-4 text-muted-foreground" />
              Custom Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {loading ? "…" : customRoles}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permission-sets">Permission Sets</TabsTrigger>
          <TabsTrigger value="access-reviews">Access Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>All Roles</CardTitle>
                <div className="flex items-center gap-2">
                  <InputGroup className="w-64">
                    <InputGroupAddon>
                      <Search className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Search roles..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  Loading roles...
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12 text-sm text-destructive">
                  {error}
                </div>
              ) : filteredRoles.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  {search || typeFilter !== "all"
                    ? "No roles match your filters."
                    : "No roles yet. Create your first role to get started."}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredRoles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg border bg-card">
                          {role.is_builtin ? (
                            <Lock className="size-4 text-muted-foreground" />
                          ) : (
                            <Shield className="size-4 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{role.name}</span>
                            {role.is_builtin && (
                              <Badge variant="secondary" className="text-[10px]">
                                System
                              </Badge>
                            )}
                            {role.slug && (
                              <span className="text-xs text-muted-foreground">
                                {role.slug}
                              </span>
                            )}
                          </div>
                          {role.description && (
                            <p className="truncate text-sm text-muted-foreground">
                              {role.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="tabular-nums">{role.user_count} users</span>
                        <span className="tabular-nums">P{role.priority ?? 1}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(role)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        {!role.is_builtin && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(role)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permission-sets" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Sets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                Permission Sets coming soon. Group permissions into reusable sets for faster role assignment.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access-reviews" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                Access Reviews coming soon. Schedule and track periodic access audits.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create Role" : "Edit Role"}
        onSubmit={handleSubmit}
        loading={saving}
        contentClassName="max-w-2xl"
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
            rows={2}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Permissions</Label>
            <span className="text-xs text-muted-foreground">
              {form.permission_ids.length} selected
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto rounded-lg border p-3 space-y-4">
            {groupedPermissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Loading permissions...
              </p>
            ) : (
              groupedPermissions.map(([appLabel, perms]) => (
                <div key={appLabel}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium capitalize text-muted-foreground">
                      {appLabel}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px]"
                      onClick={() =>
                        selectAllInGroup(perms, !allInGroupSelected(perms))
                      }
                    >
                      {allInGroupSelected(perms) ? (
                        <>
                          <X className="size-3" />
                          Deselect all
                        </>
                      ) : (
                        <>
                          <Check className="size-3" />
                          Select all
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-1">
                    {perms.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm transition-colors hover:bg-muted"
                      >
                        <Checkbox
                          checked={form.permission_ids.includes(perm.id)}
                          onCheckedChange={() => togglePermission(perm.id)}
                        />
                        <span className="truncate">{perm.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </FormDialog>
    </div>
  );
}
