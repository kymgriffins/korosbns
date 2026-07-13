"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminModulesApi,
  type AdminChapter,
  type AdminModule,
  type AdminModuleDetail,
} from "@/lib/admin-api";

type Mode = "create" | "edit";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}

const emptyForm = () => ({
  title: "",
  slug: "",
  description: "",
  image_url: "",
  status: "draft",
  author_is_team: false,
});

export default function AdminModulesPage() {
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [detail, setDetail] = useState<AdminModuleDetail | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterSaving, setChapterSaving] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminModulesApi.list({ search: search || undefined });
      setModules(res.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load modules");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setDetail(null);
    setForm(emptyForm());
    setChapterTitle("");
    setDialogOpen(true);
  };

  const openEdit = async (m: AdminModule) => {
    setMode("edit");
    setEditId(m.id);
    setSaving(true);
    setDialogOpen(true);
    try {
      const full = await adminModulesApi.get(m.id);
      setDetail(full);
      setForm({
        title: full.title,
        slug: full.slug,
        description: full.description || "",
        image_url: full.image_url || "",
        status: full.status,
        author_is_team: !!full.author_is_team,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load module");
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        image_url: form.image_url.trim(),
        status: form.status,
        author_is_team: form.author_is_team,
      };
      if (mode === "create") {
        const created = await adminModulesApi.create(payload);
        toast.success("Module created");
        setMode("edit");
        setEditId(created.id);
        setDetail(created);
      } else if (editId) {
        const updated = await adminModulesApi.update(editId, payload);
        toast.success("Module updated");
        setDetail(updated);
      }
      fetchModules();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this module and its chapters?")) return;
    try {
      await adminModulesApi.delete(id);
      toast.success("Module deleted");
      fetchModules();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleTransition = async (action: string) => {
    if (!editId) return;
    setTransitioning(true);
    try {
      await adminModulesApi.transition(editId, action);
      const full = await adminModulesApi.get(editId);
      setDetail(full);
      setForm((f) => ({ ...f, status: full.status }));
      toast.success(`Module moved to ${full.status}`);
      fetchModules();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Transition failed");
    } finally {
      setTransitioning(false);
    }
  };

  const handleAddChapter = async () => {
    if (!editId || !chapterTitle.trim()) {
      toast.error("Chapter title is required");
      return;
    }
    setChapterSaving(true);
    try {
      await adminModulesApi.createChapter(editId, { title: chapterTitle.trim() });
      const full = await adminModulesApi.get(editId);
      setDetail(full);
      setChapterTitle("");
      toast.success("Chapter added");
      fetchModules();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add chapter");
    } finally {
      setChapterSaving(false);
    }
  };

  const handleDeleteChapter = async (chapter: AdminChapter) => {
    if (!editId || !confirm(`Delete chapter "${chapter.title}"?`)) return;
    try {
      await adminModulesApi.deleteChapter(editId, chapter.id);
      const full = await adminModulesApi.get(editId);
      setDetail(full);
      toast.success("Chapter deleted");
      fetchModules();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete chapter");
    }
  };

  const columns: Column<AdminModule>[] = [
    { key: "title", header: "Title", cell: (m) => <span className="font-medium">{m.title}</span> },
    { key: "slug", header: "Slug", cell: (m) => <span className="text-sm text-muted-foreground">{m.slug}</span> },
    {
      key: "status",
      header: "Status",
      cell: (m) => (
        <Badge variant={m.status === "published" ? "default" : "secondary"} className="capitalize text-[10px]">
          {m.status}
        </Badge>
      ),
    },
    {
      key: "chapters",
      header: "Chapters",
      cell: (m) => <span className="tabular-nums text-muted-foreground">{m.chapter_count ?? 0}</span>,
    },
    {
      key: "updated",
      header: "Updated",
      cell: (m) => (
        <span className="text-sm text-muted-foreground">{new Date(m.updated_at).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      cell: (m) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(m)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleDelete(m.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Modules</h1>
        <p className="text-sm text-muted-foreground">Create and edit civic learning modules and chapters</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={modules}
            loading={loading}
            error={error}
            searchable
            searchValue={search}
            onSearchChange={setSearch}
            onCreate={openCreate}
            createLabel="Add Module"
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create Module" : "Edit Module"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({
                ...f,
                title,
                slug: mode === "create" ? slugify(title) : f.slug,
              }));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Cover image URL</Label>
          <Input
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://"
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mode === "edit" && detail?.allowed_actions && detail.allowed_actions.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {detail.allowed_actions.map((action) => (
              <Button
                key={action}
                type="button"
                size="sm"
                variant="outline"
                disabled={transitioning}
                onClick={() => handleTransition(action)}
              >
                {action.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        ) : null}

        {mode === "edit" && editId ? (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Chapters</Label>
              <span className="text-xs text-muted-foreground">{detail?.chapters?.length ?? 0} total</span>
            </div>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {(detail?.chapters ?? []).map((ch) => (
                <div key={ch.id} className="flex items-center justify-between rounded-md border px-2 py-1.5 text-sm">
                  <span>
                    <span className="mr-2 text-muted-foreground">{ch.order + 1}.</span>
                    {ch.title}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => handleDeleteChapter(ch)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
              {(detail?.chapters ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground">No chapters yet.</p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Input
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="New chapter title"
              />
              <Button type="button" size="sm" onClick={handleAddChapter} disabled={chapterSaving}>
                <Plus className="mr-1 size-3.5" />
                Add
              </Button>
            </div>
          </div>
        ) : null}
      </FormDialog>
    </div>
  );
}
