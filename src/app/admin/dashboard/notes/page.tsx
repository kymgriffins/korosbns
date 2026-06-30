"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle, Eye, Pencil, Plus, Send, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import { taskData } from "@/data/tasks";
import type { AdminNote } from "@/lib/admin-api";

type Mode = "create" | "edit";

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-0" },
    published: { label: "Published", className: "bg-green-500/10 text-green-700 dark:text-green-300 border-0" },
    archived: { label: "Archived", className: "bg-muted text-muted-foreground border-0" },
  };
  const m = map[status] ?? { label: status, className: "" };
  return <Badge className={m.className}>{m.label}</Badge>;
};

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [auditNote, setAuditNote] = useState("");
  const [form, setForm] = useState({ title: "", content: "", is_public: false });

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await taskData.notes.fetch({ page, search: search || undefined, status: statusFilter || undefined });
      setNotes(res.results);
      setTotalPages(Math.max(1, Math.ceil(res.count / 25)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const resetForm = () => setForm({ title: "", content: "", is_public: false });

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (note: AdminNote) => {
    setMode("edit");
    setEditId(note.id);
    setForm({ title: note.title, content: note.content ?? "", is_public: note.is_public });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (mode === "create") {
        await taskData.notes.create(form);
        toast.success("Note created");
      } else if (editId) {
        await taskData.notes.update(editId, form);
        toast.success("Note updated");
      }
      setDialogOpen(false);
      fetchNotes();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    try {
      await taskData.notes.delete(id);
      toast.success("Note deleted");
      fetchNotes();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await taskData.notes.publish(id);
      toast.success("Note published");
      fetchNotes();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const handleAudit = async () => {
    if (!editId || !auditNote.trim()) { toast.error("Audit notes are required"); return; }
    setSaving(true);
    try {
      await taskData.notes.audit(editId, auditNote);
      toast.success("Note audited");
      setAuditDialogOpen(false);
      setAuditNote("");
      fetchNotes();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Audit failed");
    } finally {
      setSaving(false);
    }
  };

  const openAudit = (note: AdminNote) => {
    setEditId(note.id);
    setAuditNote("");
    setAuditDialogOpen(true);
  };

  const columns: Column<AdminNote>[] = [
    { key: "title", header: "Title", cell: (n) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{n.title}</span>
        {n.is_public && <Badge variant="outline" className="text-[10px]">Public</Badge>}
      </div>
    )},
    { key: "status", header: "Status", cell: (n) => statusBadge(n.status) },
    { key: "author", header: "Author", cell: (n) => <span className="text-muted-foreground text-sm">{n.author_name ?? "—"}</span> },
    { key: "updated", header: "Updated", cell: (n) => <span className="text-sm text-muted-foreground">{new Date(n.updated_at).toLocaleDateString()}</span> },
    { key: "published", header: "Published", cell: (n) => n.published_at ? <span className="text-sm text-muted-foreground">{new Date(n.published_at).toLocaleDateString()}</span> : <span className="text-muted-foreground/50">—</span> },
    { key: "actions", header: "", className: "w-32", cell: (n) => (
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(n)}><Pencil className="size-3.5" /></Button>
        {n.status === "draft" && (
          <Button variant="ghost" size="icon-sm" onClick={() => handlePublish(n.id)} className="text-emerald-600 hover:text-emerald-600">
            <Send className="size-3.5" />
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" onClick={() => openAudit(n)} className="text-amber-600 hover:text-amber-600">
          <Shield className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(n.id)} className="text-destructive hover:text-destructive">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    )},
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
        <p className="text-sm text-muted-foreground">Manage weekly notes, audits, and publications</p>
      </div>

      <div className="flex items-center gap-2">
        {["", "draft", "published", "archived"].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>All Notes</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={notes}
            loading={loading}
            error={error}
            searchable
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            onCreate={openCreate}
            createLabel="New Note"
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create Note" : "Edit Note"}
        onSubmit={handleSubmit} loading={saving}
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Weekly note title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} placeholder="Note content..." />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.is_public} onCheckedChange={(v) => setForm({ ...form, is_public: v })} id="is_public" />
          <Label htmlFor="is_public">Public note</Label>
        </div>
      </FormDialog>

      <FormDialog open={auditDialogOpen} onOpenChange={setAuditDialogOpen}
        title="Audit Note" onSubmit={handleAudit} loading={saving} submitLabel="Submit Audit"
      >
        <div className="space-y-2">
          <Label htmlFor="audit_notes">Audit Notes</Label>
          <Textarea id="audit_notes" value={auditNote} onChange={(e) => setAuditNote(e.target.value)} rows={4} placeholder="Enter audit findings..." />
        </div>
      </FormDialog>
    </div>
  );
}
