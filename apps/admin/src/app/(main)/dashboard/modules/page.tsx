"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import { adminModulesApi, type AdminModule } from "@/lib/admin-api";

type Mode = "create" | "edit";

export default function AdminModulesPage() {
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", badge: "", badgeName: "", status: "draft" });

  const fetchModules = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await adminModulesApi.list({ page, search: search || undefined });
      setModules(res.results);
      setTotalPages(Math.max(1, Math.ceil(res.count / 25)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load modules");
    } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchModules(); }, [fetchModules]);

  const resetForm = () => setForm({ title: "", description: "", badge: "", badgeName: "", status: "draft" });

  const openCreate = () => { setMode("create"); setEditSlug(null); resetForm(); setDialogOpen(true); };

  const openEdit = (m: AdminModule) => {
    setMode("edit"); setEditSlug(m.slug);
    setForm({ title: m.title, description: m.description, badge: m.badge, badgeName: m.badgeName, status: m.status });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (mode === "create") { await adminModulesApi.create(form); toast.success("Module created"); }
      else if (editSlug) { await adminModulesApi.update(editSlug, form); toast.success("Module updated"); }
      setDialogOpen(false); fetchModules();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Operation failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this module and all its content?")) return;
    try { await adminModulesApi.delete(slug); toast.success("Module deleted"); fetchModules(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Delete failed"); }
  };

  const columns: Column<AdminModule>[] = [
    { key: "title", header: "Title", cell: (m) => <span className="font-medium">{m.title}</span> },
    { key: "badge", header: "Badge", cell: (m) => m.badgeName ? <Badge variant="secondary" className="text-[10px]">{m.badgeName}</Badge> : <span className="text-muted-foreground">—</span> },
    { key: "status", header: "Status", cell: (m) => <Badge variant={m.status === "published" ? "default" : "secondary"} className="capitalize text-[10px]">{m.status}</Badge> },
    { key: "steps", header: "Steps", cell: (m) => <span className="tabular-nums text-muted-foreground">{m.steps?.length ?? 0}</span> },
    { key: "created", header: "Created", cell: (m) => <span className="text-sm text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span> },
    { key: "actions", header: "", className: "w-24", cell: (m) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(m)}><Pencil className="size-3.5" /></Button>
        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(m.slug)} className="text-destructive hover:text-destructive"><Trash2 className="size-3.5" /></Button>
      </div>
    )},
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Modules</h1><p className="text-sm text-muted-foreground">Manage civic education modules</p></div>
      <Card><CardHeader><CardTitle>All Modules</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={modules} loading={loading} error={error}
            searchable searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
            onCreate={openCreate} createLabel="Add Module"
            page={page} totalPages={totalPages} onPageChange={setPage} />
        </CardContent>
      </Card>
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={mode === "create" ? "Create Module" : "Edit Module"} onSubmit={handleSubmit} loading={saving}>
        <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Badge Code</Label><Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g., bronze" /></div>
          <div className="space-y-2"><Label>Badge Name</Label><Input value={form.badgeName} onChange={(e) => setForm({ ...form, badgeName: e.target.value })} placeholder="e.g., Bronze" /></div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormDialog>
    </div>
  );
}
