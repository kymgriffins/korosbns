"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminSurveysApi,
  type AdminSurvey,
  type AdminSurveyDetail,
  type AdminSurveyQuestion,
} from "@/lib/admin-api";

type Mode = "create" | "edit";

const QUESTION_TYPES = [
  { value: "single", label: "Single choice" },
  { value: "multiple", label: "Multiple choice" },
  { value: "text", label: "Text" },
  { value: "textarea", label: "Textarea" },
  { value: "rating", label: "Rating" },
  { value: "boolean", label: "Boolean" },
];

const emptyForm = () => ({
  title: "",
  description: "",
  image_url: "",
  external_url: "",
  allow_anonymous: true,
  starts_at: "",
  ends_at: "",
});

const emptyQuestion = () => ({
  text: "",
  question_type: "single",
  choices: "",
  is_required: true,
  order: "0",
});

export default function AdminSurveysPage() {
  const [surveys, setSurveys] = useState<AdminSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [detail, setDetail] = useState<AdminSurveyDetail | null>(null);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [questionSaving, setQuestionSaving] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminSurveysApi.list({ search: search || undefined });
      setSurveys(res.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load surveys");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setDetail(null);
    setForm(emptyForm());
    setQuestionForm(emptyQuestion());
    setDialogOpen(true);
  };

  const openEdit = async (s: AdminSurvey) => {
    setMode("edit");
    setEditId(s.id);
    setSaving(true);
    setDialogOpen(true);
    try {
      const full = await adminSurveysApi.get(s.id);
      setDetail(full);
      setForm({
        title: full.title,
        description: full.description || "",
        image_url: full.image_url || "",
        external_url: full.external_url || "",
        allow_anonymous: full.allow_anonymous,
        starts_at: full.starts_at ? full.starts_at.slice(0, 16) : "",
        ends_at: full.ends_at ? full.ends_at.slice(0, 16) : "",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load survey");
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
        description: form.description.trim(),
        image_url: form.image_url.trim(),
        external_url: form.external_url.trim(),
        allow_anonymous: form.allow_anonymous,
        starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
      };
      if (mode === "create") {
        const created = await adminSurveysApi.create(payload);
        toast.success("Survey created");
        setMode("edit");
        setEditId(created.id);
        setDetail(created);
      } else if (editId) {
        const updated = await adminSurveysApi.update(editId, payload);
        toast.success("Survey updated");
        setDetail(updated);
      }
      fetchSurveys();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this survey?")) return;
    try {
      await adminSurveysApi.delete(id);
      toast.success("Survey deleted");
      fetchSurveys();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleTransition = async (statusValue: string) => {
    if (!editId) return;
    setTransitioning(true);
    try {
      const updated = await adminSurveysApi.transition(editId, statusValue);
      setDetail(updated);
      toast.success(`Survey is now ${updated.status}`);
      fetchSurveys();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Status change failed");
    } finally {
      setTransitioning(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!editId || !questionForm.text.trim()) {
      toast.error("Question text is required");
      return;
    }
    setQuestionSaving(true);
    try {
      const choices = questionForm.choices
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      await adminSurveysApi.createQuestion(editId, {
        text: questionForm.text.trim(),
        question_type: questionForm.question_type,
        choices,
        is_required: questionForm.is_required,
        order: Number(questionForm.order) || 0,
      });
      const full = await adminSurveysApi.get(editId);
      setDetail(full);
      setQuestionForm(emptyQuestion());
      toast.success("Question added");
      fetchSurveys();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add question");
    } finally {
      setQuestionSaving(false);
    }
  };

  const handleDeleteQuestion = async (q: AdminSurveyQuestion) => {
    if (!editId || !confirm("Remove this question?")) return;
    try {
      await adminSurveysApi.deleteQuestion(editId, q.id);
      const full = await adminSurveysApi.get(editId);
      setDetail(full);
      toast.success("Question removed");
      fetchSurveys();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove question");
    }
  };

  const columns: Column<AdminSurvey>[] = [
    { key: "title", header: "Title", cell: (s) => <span className="font-medium">{s.title}</span> },
    {
      key: "status",
      header: "Status",
      cell: (s) => (
        <Badge variant={s.status === "ACTIVE" ? "default" : "secondary"} className="text-[10px]">
          {s.status}
        </Badge>
      ),
    },
    {
      key: "questions",
      header: "Questions",
      cell: (s) => <span className="tabular-nums text-muted-foreground">{s.question_count ?? 0}</span>,
    },
    {
      key: "responses",
      header: "Responses",
      cell: (s) => <span className="tabular-nums text-muted-foreground">{s.response_count ?? 0}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "w-28",
      cell: (s) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/dashboard/surveys/${s.id}/results`}>
              <BarChart3 className="size-3.5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(s)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleDelete(s.id)}
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
        <h1 className="text-2xl font-semibold tracking-tight">Surveys</h1>
        <p className="text-sm text-muted-foreground">Design surveys, manage questions, and review results</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Surveys</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={surveys}
            loading={loading}
            error={error}
            searchable
            searchValue={search}
            onSearchChange={setSearch}
            onCreate={openCreate}
            createLabel="Add Survey"
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create Survey" : "Edit Survey"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Starts at</Label>
            <Input
              type="datetime-local"
              value={form.starts_at}
              onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Ends at</Label>
            <Input
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>External URL (optional)</Label>
          <Input
            value={form.external_url}
            onChange={(e) => setForm({ ...form, external_url: e.target.value })}
            placeholder="https://surveycto..."
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Allow anonymous</Label>
          <Switch
            checked={form.allow_anonymous}
            onCheckedChange={(v) => setForm({ ...form, allow_anonymous: v })}
          />
        </div>

        {mode === "edit" && detail ? (
          <>
            <div className="flex flex-wrap items-center gap-2 border-t pt-3">
              <Badge variant="secondary">{detail.status}</Badge>
              {(detail.allowed_transitions ?? []).map((st) => (
                <Button
                  key={st}
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={transitioning}
                  onClick={() => handleTransition(st)}
                >
                  → {st}
                </Button>
              ))}
              <Button type="button" size="sm" variant="ghost" asChild>
                <Link href={`/dashboard/surveys/${detail.id}/results`}>View results</Link>
              </Button>
            </div>

            <div className="space-y-3 border-t pt-4">
              <Label className="text-sm font-medium">Questions</Label>
              <div className="max-h-36 space-y-1 overflow-y-auto">
                {(detail.questions ?? []).map((q) => (
                  <div key={q.id} className="flex items-center justify-between rounded-md border px-2 py-1.5 text-sm">
                    <span className="truncate">
                      <span className="mr-2 text-muted-foreground">{q.question_type}</span>
                      {q.text}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      onClick={() => handleDeleteQuestion(q)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="space-y-2 rounded-md border p-3">
                <Input
                  placeholder="Question text"
                  value={questionForm.text}
                  onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={questionForm.question_type}
                    onValueChange={(v) => setQuestionForm({ ...questionForm, question_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUESTION_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Choices (comma-separated)"
                    value={questionForm.choices}
                    onChange={(e) => setQuestionForm({ ...questionForm, choices: e.target.value })}
                  />
                </div>
                <Button type="button" size="sm" onClick={handleAddQuestion} disabled={questionSaving}>
                  <Plus className="mr-1 size-3.5" />
                  Add question
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </FormDialog>
    </div>
  );
}
