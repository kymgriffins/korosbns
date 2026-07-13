"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminModulesApi,
  adminTriviaApi,
  type AdminModule,
  type AdminTrivia,
  type AdminTriviaDetail,
  type AdminTriviaQuestion,
} from "@/lib/admin-api";

type Mode = "create" | "edit";

const emptyForm = () => ({
  title: "",
  source_link: "",
  points: "10",
  expiry_hours: "168",
});

const emptyQuestion = () => ({
  question_text: "",
  option_0: "",
  option_1: "",
  option_2: "",
  option_3: "",
  correct_index: "0",
  explanation: "",
  order: "0",
});

export default function AdminTriviaPage() {
  const [items, setItems] = useState<AdminTrivia[]>([]);
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [detail, setDetail] = useState<AdminTriviaDetail | null>(null);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [questionSaving, setQuestionSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const fetchTrivia = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [res, mods] = await Promise.all([
        adminTriviaApi.list({ search: search || undefined }),
        adminModulesApi.list(),
      ]);
      setItems(res.results ?? []);
      setModules(mods.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trivia");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchTrivia();
  }, [fetchTrivia]);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setDetail(null);
    setForm(emptyForm());
    setQuestionForm(emptyQuestion());
    setDialogOpen(true);
  };

  const openEdit = async (t: AdminTrivia) => {
    setMode("edit");
    setEditId(t.id);
    setSaving(true);
    setDialogOpen(true);
    try {
      const full = await adminTriviaApi.get(t.id);
      setDetail(full);
      setForm({
        title: full.title,
        source_link: full.source_link || `${full.source_content_type}:${full.source_content_id}`,
        points: String(full.points ?? 10),
        expiry_hours: String(full.expiry_hours ?? 168),
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load trivia");
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.source_link.trim()) {
      toast.error("Title and source link are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        source_link: form.source_link.trim(),
        points: Number(form.points) || 10,
        expiry_hours: Number(form.expiry_hours) || 168,
      };
      if (mode === "create") {
        const created = await adminTriviaApi.create(payload);
        toast.success("Trivia created");
        setMode("edit");
        setEditId(created.id);
        setDetail(created);
      } else if (editId) {
        const updated = await adminTriviaApi.update(editId, payload);
        toast.success("Trivia updated");
        setDetail(updated);
      }
      fetchTrivia();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this trivia set?")) return;
    try {
      await adminTriviaApi.delete(id);
      toast.success("Trivia deleted");
      fetchTrivia();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handlePublish = async () => {
    if (!editId) return;
    setPublishing(true);
    try {
      const updated = await adminTriviaApi.publish(editId);
      setDetail(updated);
      toast.success("Trivia published");
      fetchTrivia();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!editId || !questionForm.question_text.trim()) {
      toast.error("Question text is required");
      return;
    }
    const options = [
      questionForm.option_0,
      questionForm.option_1,
      questionForm.option_2,
      questionForm.option_3,
    ].filter((o) => o.trim());
    if (options.length < 2) {
      toast.error("At least two options are required");
      return;
    }
    setQuestionSaving(true);
    try {
      await adminTriviaApi.createQuestion(editId, {
        question_text: questionForm.question_text.trim(),
        options,
        correct_index: Number(questionForm.correct_index) || 0,
        explanation: questionForm.explanation.trim(),
        order: Number(questionForm.order) || 0,
      });
      const full = await adminTriviaApi.get(editId);
      setDetail(full);
      setQuestionForm(emptyQuestion());
      toast.success("Question added");
      fetchTrivia();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add question");
    } finally {
      setQuestionSaving(false);
    }
  };

  const handleDeleteQuestion = async (q: AdminTriviaQuestion) => {
    if (!editId || !confirm("Remove this question?")) return;
    try {
      await adminTriviaApi.deleteQuestion(editId, q.id);
      const full = await adminTriviaApi.get(editId);
      setDetail(full);
      toast.success("Question removed");
      fetchTrivia();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove question");
    }
  };

  const columns: Column<AdminTrivia>[] = [
    { key: "title", header: "Title", cell: (t) => <span className="font-medium">{t.title}</span> },
    {
      key: "status",
      header: "Status",
      cell: (t) => (
        <Badge variant={t.status === "PUBLISHED" ? "default" : "secondary"} className="text-[10px]">
          {t.status}
        </Badge>
      ),
    },
    {
      key: "questions",
      header: "Questions",
      cell: (t) => <span className="tabular-nums text-muted-foreground">{t.question_count ?? 0}</span>,
    },
    {
      key: "attempts",
      header: "Attempts",
      cell: (t) => <span className="tabular-nums text-muted-foreground">{t.attempt_count ?? 0}</span>,
    },
    {
      key: "points",
      header: "Points",
      cell: (t) => <span className="tabular-nums text-muted-foreground">{t.points}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "w-28",
      cell: (t) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/dashboard/trivia/${t.id}/attempts`}>
              <Eye className="size-3.5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(t)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleDelete(t.id)}
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
        <h1 className="text-2xl font-semibold tracking-tight">Trivia</h1>
        <p className="text-sm text-muted-foreground">Build quizzes, publish, and inspect attempts</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Trivia</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={items}
            loading={loading}
            error={error}
            searchable
            searchValue={search}
            onSearchChange={setSearch}
            onCreate={openCreate}
            createLabel="Add Trivia"
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create Trivia" : "Edit Trivia"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Source (civic module)</Label>
          <select
            className="border-input bg-background flex h-9 w-full rounded-md border px-3 text-sm"
            value={form.source_link}
            onChange={(e) => setForm({ ...form, source_link: e.target.value })}
          >
            <option value="">Select module…</option>
            {modules.map((m) => (
              <option key={m.id} value={`civic-module:${m.id}`}>
                {m.title}
              </option>
            ))}
          </select>
          <Input
            className="mt-1"
            value={form.source_link}
            onChange={(e) => setForm({ ...form, source_link: e.target.value })}
            placeholder="civic-module:uuid"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Points</Label>
            <Input
              type="number"
              value={form.points}
              onChange={(e) => setForm({ ...form, points: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Expiry hours</Label>
            <Input
              type="number"
              value={form.expiry_hours}
              onChange={(e) => setForm({ ...form, expiry_hours: e.target.value })}
            />
          </div>
        </div>

        {mode === "edit" && detail ? (
          <>
            <div className="flex flex-wrap items-center gap-2 border-t pt-3">
              <Badge variant="secondary">{detail.status}</Badge>
              {detail.status === "DRAFT" ? (
                <Button type="button" size="sm" variant="outline" disabled={publishing} onClick={handlePublish}>
                  Publish
                </Button>
              ) : null}
              <Button type="button" size="sm" variant="ghost" asChild>
                <Link href={`/dashboard/trivia/${detail.id}/attempts`}>View attempts</Link>
              </Button>
            </div>

            <div className="space-y-3 border-t pt-4">
              <Label className="text-sm font-medium">Questions</Label>
              <div className="max-h-36 space-y-1 overflow-y-auto">
                {(detail.questions ?? []).map((q) => (
                  <div key={q.id} className="flex items-center justify-between rounded-md border px-2 py-1.5 text-sm">
                    <span className="truncate">{q.question_text}</span>
                    {detail.status === "DRAFT" ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive"
                        onClick={() => handleDeleteQuestion(q)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
              {detail.status === "DRAFT" ? (
                <div className="space-y-2 rounded-md border p-3">
                  <Input
                    placeholder="Question text"
                    value={questionForm.question_text}
                    onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Option A"
                      value={questionForm.option_0}
                      onChange={(e) => setQuestionForm({ ...questionForm, option_0: e.target.value })}
                    />
                    <Input
                      placeholder="Option B"
                      value={questionForm.option_1}
                      onChange={(e) => setQuestionForm({ ...questionForm, option_1: e.target.value })}
                    />
                    <Input
                      placeholder="Option C"
                      value={questionForm.option_2}
                      onChange={(e) => setQuestionForm({ ...questionForm, option_2: e.target.value })}
                    />
                    <Input
                      placeholder="Option D"
                      value={questionForm.option_3}
                      onChange={(e) => setQuestionForm({ ...questionForm, option_3: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={3}
                      placeholder="Correct index (0-3)"
                      value={questionForm.correct_index}
                      onChange={(e) => setQuestionForm({ ...questionForm, correct_index: e.target.value })}
                    />
                    <Input
                      placeholder="Explanation"
                      value={questionForm.explanation}
                      onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                    />
                  </div>
                  <Button type="button" size="sm" onClick={handleAddQuestion} disabled={questionSaving}>
                    <Plus className="mr-1 size-3.5" />
                    Add question
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Questions are locked after publish.</p>
              )}
            </div>
          </>
        ) : null}
      </FormDialog>
    </div>
  );
}
