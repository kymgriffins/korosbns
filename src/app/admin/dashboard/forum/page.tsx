"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import type { AdminForumThread } from "@/lib/admin-api";
import { adminContentData } from "@/data/admin-content";

type Mode = "create" | "edit";

export default function AdminForumPage() {
  const [threads, setThreads] = useState<AdminForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", civic_module: "" });

  const fetchThreads = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await adminContentData.forum.fetchList({ page, search: search || undefined });
      setThreads(res.results);
      setTotalPages(Math.max(1, Math.ceil(res.count / 25)));
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load threads"); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchThreads(); }, [fetchThreads]);

  const resetForm = () => setForm({ title: "", civic_module: "" });

  const openCreate = () => { setMode("create"); setEditId(null); resetForm(); setDialogOpen(true); };

  const openEdit = (t: AdminForumThread) => {
    setMode("edit"); setEditId(t.id);
    setForm({ title: t.title, civic_module: t.civic_module || "" });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (mode === "create") {
        await adminContentData.forum.create({ title: form.title, civic_module: form.civic_module || null });
        toast.success("Thread created");
      } else if (editId) {
        await adminContentData.forum.update(editId, { title: form.title, civic_module: form.civic_module || null });
        toast.success("Thread updated");
      }
      setDialogOpen(false); fetchThreads();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Operation failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this thread and all its posts?")) return;
    try { await adminContentData.forum.deleteThread(id); toast.success("Thread deleted"); fetchThreads(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Delete failed"); }
  };

  const columns: Column<AdminForumThread>[] = [
    { key: "title", header: "Thread", cell: (t) => (
      <div className="flex items-center gap-2">
        <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
        <span className="font-medium line-clamp-1">{t.title}</span>
      </div>
    )},
    { key: "author", header: "Author", cell: (t) => <span className="text-sm text-muted-foreground">{t.author_name}</span> },
    { key: "posts", header: "Posts", cell: (t) => <Badge variant="secondary" className="tabular-nums">{t.posts_count}</Badge> },
    { key: "module", header: "Module", cell: (t) => <span className="text-sm text-muted-foreground">{t.civic_module || "General"}</span> },
    { key: "created", header: "Created", cell: (t) => <span className="text-sm text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</span> },
    { key: "actions", header: "", className: "w-24", cell: (t) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(t)}><Pencil className="size-3.5" /></Button>
        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(t.id)} className="text-destructive hover:text-destructive"><Trash2 className="size-3.5" /></Button>
      </div>
    )},
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Forum</h1><p className="text-sm text-muted-foreground">Moderate discussion threads</p></div>
      <Card><CardHeader><CardTitle>All Threads</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={threads} loading={loading} error={error}
            searchable searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
            onCreate={openCreate} createLabel="Add Thread"
            page={page} totalPages={totalPages} onPageChange={setPage} />
        </CardContent>
      </Card>
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={mode === "create" ? "Create Thread" : "Edit Thread"} onSubmit={handleSubmit} loading={saving}>
        <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2"><Label>Civic Module (optional)</Label><Input value={form.civic_module} onChange={(e) => setForm({ ...form, civic_module: e.target.value })} placeholder="e.g. understanding-budgets" /></div>
      </FormDialog>
    </div>
  );
}
