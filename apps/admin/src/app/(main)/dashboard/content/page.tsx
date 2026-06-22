"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import { adminContentApi, type AdminContentItem } from "@/lib/admin-api";

const CONTENT_TABS = [
  { value: "articles", label: "Articles" },
  { value: "videos", label: "Videos" },
  { value: "stories", label: "Stories" },
  { value: "documents", label: "Documents" },
];

type Mode = "create" | "edit";

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState("articles");
  const [items, setItems] = useState<AdminContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", summary: "", difficulty: "beginner", status: "draft" });

  const fetchItems = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await adminContentApi.list(activeTab, { page, search: search || undefined });
      setItems(res.results);
      setTotalPages(Math.max(1, Math.ceil(res.count / 25)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally { setLoading(false); }
  }, [activeTab, page, search]);

  useEffect(() => { fetchItems(); }, [fetchItems]);
  useEffect(() => { setPage(1); }, [activeTab]);

  const resetForm = () => setForm({ title: "", summary: "", difficulty: "beginner", status: "draft" });

  const openCreate = () => { setMode("create"); setEditId(null); resetForm(); setDialogOpen(true); };

  const openEdit = (item: AdminContentItem) => {
    setMode("edit"); setEditId(item.id);
    setForm({ title: item.title, summary: item.summary ?? "", difficulty: item.difficulty ?? "beginner", status: item.status });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (mode === "create") { await adminContentApi.create(activeTab, form); toast.success("Content created"); }
      else if (editId) { await adminContentApi.update(activeTab, editId, form); toast.success("Content updated"); }
      setDialogOpen(false); fetchItems();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Operation failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try { await adminContentApi.delete(activeTab, id); toast.success("Content deleted"); fetchItems(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Delete failed"); }
  };

  const columns: Column<AdminContentItem>[] = [
    { key: "title", header: "Title", cell: (c) => <span className="font-medium line-clamp-1">{c.title}</span> },
    { key: "status", header: "Status", cell: (c) => <Badge variant={c.status === "published" ? "default" : "secondary"} className="capitalize text-[10px]">{c.status}</Badge> },
    { key: "difficulty", header: "Level", cell: (c) => c.difficulty ? <Badge variant="outline" className="capitalize text-[10px]">{c.difficulty}</Badge> : <span className="text-muted-foreground">—</span> },
    { key: "published", header: "Published", cell: (c) => <span className="text-sm text-muted-foreground">{c.published_at ? new Date(c.published_at).toLocaleDateString() : "—"}</span> },
    { key: "author", header: "Author", cell: (c) => <span className="text-sm text-muted-foreground">{c.author || "—"}</span> },
    { key: "actions", header: "", className: "w-24", cell: (c) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(c)}><Pencil className="size-3.5" /></Button>
        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(c.id)} className="text-destructive hover:text-destructive"><Trash2 className="size-3.5" /></Button>
      </div>
    )},
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div><h1 className="text-2xl font-semibold tracking-tight">Content</h1><p className="text-sm text-muted-foreground">Manage learning content across all types</p></div>
      <Card><CardHeader><CardTitle>Content Library</CardTitle></CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {CONTENT_TABS.map((t) => <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>)}
            </TabsList>
            {CONTENT_TABS.map((t) => (
              <TabsContent key={t.value} value={t.value}>
                <DataTable columns={columns} data={items} loading={loading} error={error}
                  searchable searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
                  onCreate={openCreate} createLabel={`Add ${t.label.slice(0, -1)}`}
                  page={page} totalPages={totalPages} onPageChange={setPage} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={mode === "create" ? `Create ${activeTab.slice(0, -1)}` : "Edit Content"} onSubmit={handleSubmit} loading={saving}>
        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2"><Label htmlFor="summary">Summary</Label><Textarea id="summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={3} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
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
        </div>
      </FormDialog>
    </div>
  );
}
