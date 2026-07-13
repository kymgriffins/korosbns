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
import { adminCoursesApi, type AdminCourseListItem } from "@/lib/admin-api";

type Mode = "create" | "edit";

const emptyForm = () => ({
  title: "",
  slug: "",
  module_code: "",
  summary: "",
  credits: "",
  fiscal_year: "",
  county_code: "",
  sector: "",
  image_url: "",
  external_source_url: "",
});

function stateBadgeVariant(state: string) {
  if (state === "published") return "default" as const;
  if (state === "review") return "outline" as const;
  return "secondary" as const;
}

export default function CoursesAdminPage() {
  const [items, setItems] = useState<AdminCourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [editState, setEditState] = useState("draft");
  const [lessonCount, setLessonCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminCoursesApi.list();
      setItems(res.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courses");
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
    setLessonCount(0);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = async (item: AdminCourseListItem) => {
    setMode("edit");
    setEditId(item.id);
    setEditState(item.state);
    setLessonCount(item.lesson_count ?? 0);
    setSaving(true);
    setDialogOpen(true);
    try {
      const detail = await adminCoursesApi.get(item.id);
      setForm({
        title: detail.title || "",
        slug: detail.slug || "",
        module_code: detail.module_code || "",
        summary: detail.summary || "",
        credits: detail.credits || "",
        fiscal_year: detail.fiscal_year != null ? String(detail.fiscal_year) : "",
        county_code: detail.county_code || "",
        sector: detail.sector || "",
        image_url: detail.image_url || "",
        external_source_url: detail.external_source_url || "",
      });
      setEditState(detail.state);
      setLessonCount(detail.lessons?.length ?? item.lesson_count ?? 0);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load course");
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const buildPayload = () => ({
    title: form.title.trim(),
    slug: form.slug.trim() || undefined,
    module_code: form.module_code.trim() || undefined,
    summary: form.summary,
    credits: form.credits.trim() || undefined,
    fiscal_year: form.fiscal_year.trim() ? Number(form.fiscal_year) : null,
    county_code: form.county_code.trim() || undefined,
    sector: form.sector.trim() || undefined,
    image_url: form.image_url.trim() || undefined,
    external_source_url: form.external_source_url.trim() || undefined,
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (mode === "create") {
        await adminCoursesApi.create(payload);
        toast.success("Course created as draft");
      } else if (editId) {
        await adminCoursesApi.update(editId, payload);
        toast.success("Course saved");
      }
      setDialogOpen(false);
      fetchItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const filtered = search
    ? items.filter(
        (i) =>
          i.title.toLowerCase().includes(search.toLowerCase()) ||
          (i.module_code || "").toLowerCase().includes(search.toLowerCase()) ||
          i.slug.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  const columns: Column<AdminCourseListItem>[] = [
    {
      key: "title",
      header: "Title",
      cell: (i) => <span className="font-medium line-clamp-1">{i.title}</span>,
    },
    {
      key: "code",
      header: "Code",
      cell: (i) => <span className="text-sm text-muted-foreground">{i.module_code || "—"}</span>,
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
      key: "lessons",
      header: "Lessons",
      cell: (i) => <span className="tabular-nums text-muted-foreground">{i.lesson_count}</span>,
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

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
        <p className="text-sm text-muted-foreground">
          Learning courses admin. Publish/transition is not exposed on the JSON API yet.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
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
            createLabel="Add Course"
            emptyMessage="No courses yet."
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create Course" : "Edit Course"}
        onSubmit={handleSubmit}
        loading={saving}
        contentClassName="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {mode === "edit" ? (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={stateBadgeVariant(editState)} className="capitalize">
              {editState}
            </Badge>
            <span>{lessonCount} lesson{lessonCount === 1 ? "" : "s"}</span>
            <span className="text-xs">
              Workflow transitions require Django admin (no /transition/ API).
            </span>
          </div>
        ) : null}
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Slug (optional)</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Module code</Label>
            <Input
              value={form.module_code}
              onChange={(e) => setForm({ ...form, module_code: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Summary</Label>
          <Textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Credits</Label>
            <Input value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Fiscal year</Label>
            <Input
              type="number"
              value={form.fiscal_year}
              onChange={(e) => setForm({ ...form, fiscal_year: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>County code</Label>
            <Input
              value={form.county_code}
              onChange={(e) => setForm({ ...form, county_code: e.target.value })}
              maxLength={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Sector</Label>
            <Input value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label>External source URL</Label>
          <Input
            value={form.external_source_url}
            onChange={(e) => setForm({ ...form, external_source_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </FormDialog>
    </div>
  );
}
