"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import { adminAuthorsApi, type AdminAuthor } from "@/lib/admin-api";
import { getInitials } from "@/lib/utils";

type Mode = "create" | "edit";

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<AdminAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", bio: "", image: "" });

  const fetchAuthors = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await adminAuthorsApi.list({ page, search: search || undefined });
      setAuthors(res.results);
      setTotalPages(Math.max(1, Math.ceil(res.count / 25)));
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load authors"); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchAuthors(); }, [fetchAuthors]);

  const resetForm = () => setForm({ name: "", role: "", bio: "", image: "" });

  const openCreate = () => { setMode("create"); setEditSlug(null); resetForm(); setDialogOpen(true); };

  const openEdit = (a: AdminAuthor) => {
    setMode("edit"); setEditSlug(a.slug);
    setForm({ name: a.name, role: a.role, bio: a.bio, image: a.image });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      if (mode === "create") { await adminAuthorsApi.create(form); toast.success("Author created"); }
      else if (editSlug) { await adminAuthorsApi.update(editSlug, form); toast.success("Author updated"); }
      setDialogOpen(false); fetchAuthors();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Operation failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this author?")) return;
    try { await adminAuthorsApi.delete(slug); toast.success("Author deleted"); fetchAuthors(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Delete failed"); }
  };

  const columns: Column<AdminAuthor>[] = [
    { key: "name", header: "Name", cell: (a) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-7"><AvatarImage src={a.image} alt={a.name} /><AvatarFallback className="text-[10px]">{getInitials(a.name)}</AvatarFallback></Avatar>
        <span className="font-medium">{a.name}</span>
      </div>
    )},
    { key: "role", header: "Role", cell: (a) => <span className="text-sm text-muted-foreground">{a.role}</span> },
    { key: "bio", header: "Bio", cell: (a) => <span className="text-sm text-muted-foreground line-clamp-1">{a.bio || "—"}</span> },
    { key: "created", header: "Created", cell: (a) => <span className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span> },
    { key: "actions", header: "", className: "w-24", cell: (a) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(a)}><Pencil className="size-3.5" /></Button>
        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(a.slug)} className="text-destructive hover:text-destructive"><Trash2 className="size-3.5" /></Button>
      </div>
    )},
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Authors</h1><p className="text-sm text-muted-foreground">Manage content authors</p></div>
      <Card><CardHeader><CardTitle>All Authors</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={authors} loading={loading} error={error}
            searchable searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
            onCreate={openCreate} createLabel="Add Author"
            page={page} totalPages={totalPages} onPageChange={setPage} />
        </CardContent>
      </Card>
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={mode === "create" ? "Create Author" : "Edit Author"} onSubmit={handleSubmit} loading={saving}>
        <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="space-y-2"><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g., Budget Analyst" /></div>
        <div className="space-y-2"><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
        <div className="space-y-2"><Label>Bio</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} /></div>
      </FormDialog>
    </div>
  );
}
