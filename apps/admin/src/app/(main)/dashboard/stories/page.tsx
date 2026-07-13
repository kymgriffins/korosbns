"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminContentUnitsApi,
  availableContentTransitions,
  type AdminContentUnitDetail,
  type AdminContentUnitListItem,
  type ContentTransitionAction,
} from "@/lib/admin-api";

type Format = "article" | "story";
type Mode = "create" | "edit";

const emptyForm = () => ({ title: "", slug: "", summary: "", body: "" });

function stateBadgeVariant(state: string) {
  if (state === "published") return "default" as const;
  if (state === "review") return "outline" as const;
  return "secondary" as const;
}

export default function StoriesAdminPage() {
  const [format, setFormat] = useState<Format>("article");
  const [items, setItems] = useState<AdminContentUnitListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [editState, setEditState] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminContentUnitsApi.list(format);
      setItems(res.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [format]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setEditState("draft");
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = async (item: AdminContentUnitListItem) => {
    setMode("edit");
    setEditId(item.id);
    setEditState(item.state);
    setSaving(true);
    setDialogOpen(true);
    try {
      const detail: AdminContentUnitDetail = await adminContentUnitsApi.get(format, item.id);
      setForm({
        title: detail.title || "",
        slug: detail.slug || "",
        summary: detail.summary || "",
        body: detail.body || "",
      });
      setEditState(detail.state);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load item");
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        await adminContentUnitsApi.create({
          title: form.title.trim(),
          format,
          slug: form.slug.trim() || undefined,
          summary: form.summary,
          body: form.body,
        });
        toast.success(format === "article" ? "Article created" : "Story created");
      } else if (editId) {
        await adminContentUnitsApi.update(format, editId, {
          title: form.title.trim(),
          slug: form.slug.trim() || undefined,
          summary: form.summary,
          body: form.body,
        });
        toast.success("Saved");
      }
      setDialogOpen(false);
      fetchItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleTransition = async (action: ContentTransitionAction) => {
    if (!editId) return;
    setTransitioning(true);
    try {
      const res = await adminContentUnitsApi.transition(format, editId, action);
      setEditState(res.state);
      toast.success(`State → ${res.state}`);
      fetchItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Transition failed");
    } finally {
      setTransitioning(false);
    }
  };

  const filtered = search
    ? items.filter(
        (i) =>
          i.title.toLowerCase().includes(search.toLowerCase()) ||
          i.slug.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  const columns: Column<AdminContentUnitListItem>[] = [
    {
      key: "title",
      header: "Title",
      cell: (i) => <span className="font-medium line-clamp-1">{i.title}</span>,
    },
    {
      key: "slug",
      header: "Slug",
      cell: (i) => <span className="text-sm text-muted-foreground font-mono">{i.slug}</span>,
    },
    {
      key: "state",
      header: "State",
      cell: (i) => (
        <Badge variant={stateBadgeVariant(i.state)} className="capitalize text-[10px]">
          {i.state}
        </Badge>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      cell: (i) => (
        <span className="text-sm text-muted-foreground">
          {i.updated_at ? new Date(i.updated_at).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-16",
      cell: (i) => (
        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(i)}>
          <Pencil className="size-3.5" />
        </Button>
      ),
    },
  ];

  const label = format === "article" ? "Article" : "Story";
  const transitions = mode === "edit" ? availableContentTransitions(editState) : [];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Stories & Articles</h1>
        <p className="text-sm text-muted-foreground">
          Create and edit content units, then move them through review → publish.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Library</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={format}
            onValueChange={(v) => {
              setFormat(v as Format);
              setSearch("");
            }}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="article">Articles</TabsTrigger>
              <TabsTrigger value="story">Stories</TabsTrigger>
            </TabsList>
            <TabsContent value={format}>
              <DataTable
                columns={columns}
                data={filtered}
                loading={loading}
                error={error}
                searchable
                searchValue={search}
                onSearchChange={setSearch}
                onCreate={openCreate}
                createLabel={`Add ${label}`}
                emptyMessage={`No ${format === "article" ? "articles" : "stories"} yet.`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? `Create ${label}` : `Edit ${label}`}
        onSubmit={handleSubmit}
        loading={saving}
        contentClassName="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {mode === "edit" ? (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={stateBadgeVariant(editState)} className="capitalize">
              {editState}
            </Badge>
            {transitions.map((t) => (
              <Button
                key={t.action}
                type="button"
                size="sm"
                variant={t.action === "publish" ? "default" : "outline"}
                disabled={transitioning || saving}
                onClick={() => handleTransition(t.action)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        ) : null}
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Slug (optional)</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="auto-generated if empty"
          />
        </div>
        <div className="space-y-2">
          <Label>Summary</Label>
          <Textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Body</Label>
          <Textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={10}
            className="font-mono text-sm"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Hard delete is not available via API — use archive after publish.
        </p>
      </FormDialog>
    </div>
  );
}
