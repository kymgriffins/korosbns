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
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminKnowledgeApi,
  availableContentTransitions,
  type AdminKnowledgeListItem,
  type ContentTransitionAction,
} from "@/lib/admin-api";

type Mode = "create" | "edit";

const emptyForm = () => ({ title: "", summary: "", body: "" });

function stateBadgeVariant(state: string) {
  if (state === "published") return "default" as const;
  if (state === "review") return "outline" as const;
  return "secondary" as const;
}

export default function KnowledgeAdminPage() {
  const [items, setItems] = useState<AdminKnowledgeListItem[]>([]);
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
      const res = await adminKnowledgeApi.list();
      setItems(res.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load knowledge entries");
    } finally {
      setLoading(false);
    }
  }, []);

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

  const openEdit = async (item: AdminKnowledgeListItem) => {
    setMode("edit");
    setEditId(item.id);
    setEditState(item.state);
    setSaving(true);
    setDialogOpen(true);
    try {
      const detail = await adminKnowledgeApi.get(item.id);
      setForm({
        title: detail.title || "",
        summary: detail.summary || "",
        body: detail.body || "",
      });
      setEditState(detail.state);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load entry");
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
      const payload = {
        title: form.title.trim(),
        summary: form.summary,
        body: form.body,
      };
      if (mode === "create") {
        await adminKnowledgeApi.create(payload);
        toast.success("Knowledge entry created");
      } else if (editId) {
        await adminKnowledgeApi.update(editId, payload);
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
      const res = await adminKnowledgeApi.transition(editId, action);
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
    ? items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()))
    : items;

  const columns: Column<AdminKnowledgeListItem>[] = [
    {
      key: "title",
      header: "Title",
      cell: (i) => <span className="font-medium line-clamp-1">{i.title}</span>,
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

  const transitions = mode === "edit" ? availableContentTransitions(editState) : [];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Knowledge</h1>
        <p className="text-sm text-muted-foreground">
          Knowledge base entries with draft → review → publish workflow.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filtered}
            loading={loading}
            error={error}
            searchable
            searchValue={search}
            onSearchChange={setSearch}
            onCreate={openCreate}
            createLabel="Add Entry"
            emptyMessage="No knowledge entries yet."
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create Knowledge Entry" : "Edit Knowledge Entry"}
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
      </FormDialog>
    </div>
  );
}
