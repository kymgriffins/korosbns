"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, BookOpen, ListOrdered, Loader2, Plus, Trash2, Video } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SetBreadcrumbTitle } from "@/components/admin/admin-page-breadcrumb";
import { Teachable } from "@/components/admin/teaching/teachable";
import { useRouteBase, getFullUrl } from "@/lib/route-base";
import {
  adminContentUnitsApi,
  adminModulesApi,
  adminTriviaApi,
  type AdminChapter,
  type AdminModuleDetail,
  type AdminTriviaDetail,
} from "@/lib/admin-api";
import { ModuleWizardStepper } from "./module-wizard-stepper";
import {
  MODULE_WIZARD_STEPS,
  buildModuleStepStatus,
  isModuleWizardStep,
  type ModuleWizardStepKey,
} from "./wizard-steps";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}

const emptyOverview = () => ({
  title: "",
  slug: "",
  description: "",
  image_url: "",
  status: "draft",
  author_is_team: false,
});

type Props = {
  /** `new` for create flow; otherwise module UUID */
  moduleId: string;
};

export function ModuleBuilder({ moduleId }: Props) {
  const isNew = moduleId === "new";
  const router = useRouter();
  const routeBase = useRouteBase();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const activeStep: ModuleWizardStepKey =
    !isNew && isModuleWizardStep(stepParam) ? stepParam : "overview";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<AdminModuleDetail | null>(null);
  const [trivia, setTrivia] = useState<AdminTriviaDetail | null>(null);
  const [form, setForm] = useState(emptyOverview);
  const [chapterTitle, setChapterTitle] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [articleChapterId, setArticleChapterId] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeChapterId, setYoutubeChapterId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");

  const stepStatus = useMemo(() => buildModuleStepStatus(detail, trivia), [detail, trivia]);

  const modulesHref = getFullUrl(routeBase, "/dashboard/modules");

  const setStep = useCallback(
    (step: ModuleWizardStepKey) => {
      if (isNew || !detail) return;
      const url = getFullUrl(routeBase, `/dashboard/modules/${detail.id}`);
      router.replace(step === "overview" ? url : `${url}?step=${step}`);
    },
    [detail, isNew, routeBase, router],
  );

  const refresh = useCallback(async (id: string) => {
    const full = await adminModulesApi.get(id);
    setDetail(full);
    setForm({
      title: full.title,
      slug: full.slug,
      description: full.description || "",
      image_url: full.image_url || "",
      status: full.status,
      author_is_team: !!full.author_is_team,
    });
    if (full.trivia_id) {
      try {
        const t = await adminTriviaApi.get(full.trivia_id);
        setTrivia(t);
      } catch {
        setTrivia(null);
      }
    } else {
      setTrivia(null);
    }
    return full;
  }, []);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await refresh(moduleId);
      } catch (err) {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Failed to load module");
          router.replace(modulesHref);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isNew, moduleId, modulesHref, refresh, router]);

  const saveOverview = async () => {
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
      if (isNew) {
        const created = await adminModulesApi.create(payload);
        toast.success("Module created — continue with chapters anytime");
        router.replace(getFullUrl(routeBase, `/dashboard/modules/${created.id}?step=chapters`));
      } else if (detail) {
        await adminModulesApi.update(detail.id, payload);
        await refresh(detail.id);
        toast.success("Module details saved");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addChapter = async () => {
    if (!detail || !chapterTitle.trim()) {
      toast.error("Chapter title is required");
      return;
    }
    setSaving(true);
    try {
      await adminModulesApi.createChapter(detail.id, {
        title: chapterTitle.trim(),
        order: detail.chapters?.length ?? 0,
      });
      setChapterTitle("");
      await refresh(detail.id);
      toast.success("Chapter added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add chapter");
    } finally {
      setSaving(false);
    }
  };

  const deleteChapter = async (chapter: AdminChapter) => {
    if (!detail || !confirm(`Delete chapter "${chapter.title}"?`)) return;
    setSaving(true);
    try {
      await adminModulesApi.deleteChapter(detail.id, chapter.id);
      await refresh(detail.id);
      toast.success("Chapter deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const moveChapter = async (chapterId: string, direction: -1 | 1) => {
    if (!detail?.chapters?.length) return;
    const ids = detail.chapters.map((c) => c.id);
    const idx = ids.indexOf(chapterId);
    const next = idx + direction;
    if (idx < 0 || next < 0 || next >= ids.length) return;
    const reordered = [...ids];
    [reordered[idx], reordered[next]] = [reordered[next], reordered[idx]];
    setSaving(true);
    try {
      await adminModulesApi.reorderChapters(detail.id, reordered);
      await refresh(detail.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reorder failed");
    } finally {
      setSaving(false);
    }
  };

  const addArticleToChapter = async () => {
    if (!detail || !articleChapterId || !articleTitle.trim()) {
      toast.error("Pick a chapter and enter an article title");
      return;
    }
    setSaving(true);
    try {
      const created = await adminContentUnitsApi.create({
        title: articleTitle.trim(),
        format: "article",
        slug: slugify(articleTitle.trim()),
        body: "",
        summary: "",
      });
      await adminModulesApi.linkArticle(detail.id, articleChapterId, created.id);
      setArticleTitle("");
      await refresh(detail.id);
      toast.success("Article linked to chapter");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add article");
    } finally {
      setSaving(false);
    }
  };

  const addYoutube = async () => {
    if (!detail || !youtubeChapterId || !youtubeUrl.trim()) {
      toast.error("Pick a chapter and enter a YouTube URL");
      return;
    }
    const chapter = detail.chapters?.find((c) => c.id === youtubeChapterId);
    if (!chapter) return;
    const urls = [...(chapter.youtube_urls ?? [])];
    if (chapter.youtube_url && !urls.includes(chapter.youtube_url)) urls.unshift(chapter.youtube_url);
    urls.push(youtubeUrl.trim());
    setSaving(true);
    try {
      await adminModulesApi.updateChapter(detail.id, chapter.id, {
        title: chapter.title,
        youtube_urls: urls,
        youtube_url: urls[0] ?? "",
      });
      setYoutubeUrl("");
      await refresh(detail.id);
      toast.success("YouTube URL added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add URL");
    } finally {
      setSaving(false);
    }
  };

  const removeYoutube = async (chapter: AdminChapter, index: number) => {
    if (!detail) return;
    const urls = [...(chapter.youtube_urls ?? [])];
    if (!urls.length && chapter.youtube_url) urls.push(chapter.youtube_url);
    urls.splice(index, 1);
    setSaving(true);
    try {
      await adminModulesApi.updateChapter(detail.id, chapter.id, {
        title: chapter.title,
        youtube_urls: urls,
        youtube_url: urls[0] ?? "",
      });
      await refresh(detail.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove URL");
    } finally {
      setSaving(false);
    }
  };

  const ensureTrivia = async (): Promise<AdminTriviaDetail> => {
    if (!detail) throw new Error("Module required");
    if (trivia) return trivia;
    if (detail.trivia_id) {
      const existing = await adminTriviaApi.get(detail.trivia_id);
      setTrivia(existing);
      return existing;
    }
    const created = await adminTriviaApi.create({
      title: `${detail.title} Assessment`,
      source_content_type: "civic-module",
      source_content_id: detail.id,
      points: 10,
      expiry_hours: 72,
    });
    await adminModulesApi.update(detail.id, {
      title: detail.title,
      slug: detail.slug,
      trivia_id: created.id,
    });
    const full = await adminTriviaApi.get(created.id);
    setTrivia(full);
    await refresh(detail.id);
    return full;
  };

  const addQuestion = async () => {
    if (!detail || !questionText.trim()) {
      toast.error("Question text is required");
      return;
    }
    const opts = options.map((o) => o.trim()).filter(Boolean);
    if (opts.length < 2) {
      toast.error("At least two answer options are required");
      return;
    }
    setSaving(true);
    try {
      const t = await ensureTrivia();
      await adminTriviaApi.createQuestion(t.id, {
        question_text: questionText.trim(),
        options: opts,
        correct_index: Math.min(correctIndex, opts.length - 1),
        explanation: explanation.trim(),
        order: t.questions?.length ?? 0,
      });
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectIndex(0);
      setExplanation("");
      const updated = await adminTriviaApi.get(t.id);
      setTrivia(updated);
      toast.success("Question added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add question");
    } finally {
      setSaving(false);
    }
  };

  const publishTrivia = async () => {
    if (!trivia) return;
    setSaving(true);
    try {
      const updated = await adminTriviaApi.publish(trivia.id);
      setTrivia(updated);
      toast.success("Trivia published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  };

  const runTransition = async (action: string) => {
    if (!detail) return;
    setSaving(true);
    try {
      await adminModulesApi.transition(detail.id, action);
      await refresh(detail.id);
      toast.success(`Module moved to next status (${action.replace(/_/g, " ")})`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Transition failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading module builder…
      </div>
    );
  }

  const chapters = detail?.chapters ?? [];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {detail ? <SetBreadcrumbTitle title={detail.title} /> : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isNew ? "New learning module" : detail?.title || "Module builder"}
            </h1>
            {detail ? (
              <Badge className="capitalize" variant={detail.status === "published" ? "default" : "secondary"}>
                {detail.status}
              </Badge>
            ) : (
              <Badge variant="outline">Draft setup</Badge>
            )}
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Build what citizens see in the Learning Hub. Steps guide you — they never block publishing.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push(modulesHref)}>
          Back to modules
        </Button>
      </div>

      <ModuleWizardStepper
        active={activeStep}
        status={stepStatus}
        allowAllSteps={!isNew && !!detail}
        onSelect={setStep}
      />

      {activeStep === "overview" ? (
        <Card>
          <CardHeader>
            <CardTitle>Module details</CardTitle>
            <CardDescription>
              Name it clearly — title and slug appear on `/learn`. Everything else can wait.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="module-title">Title</Label>
              <Input
                id="module-title"
                value={form.title}
                autoFocus={isNew}
                placeholder="e.g. Understanding the national budget"
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({
                    ...f,
                    title,
                    slug: isNew || !detail ? slugify(title) : f.slug,
                  }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="module-slug">URL slug</Label>
              <Input
                id="module-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="understanding-the-national-budget"
              />
              <p className="text-xs text-muted-foreground">Used in the Learning Hub link. Keep it short and stable.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="module-desc">Description</Label>
              <Textarea
                id="module-desc"
                rows={4}
                value={form.description}
                placeholder="What will learners gain from this module?"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="module-image">Cover image URL</Label>
              <Input
                id="module-image"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://"
              />
            </div>
            <div className="space-y-2">
              <Label>Working status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft — editing</SelectItem>
                  <SelectItem value="review">Review — waiting on approval</SelectItem>
                  <SelectItem value="published">Published — live on Learning Hub</SelectItem>
                  <SelectItem value="archived">Archived — hidden</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Prefer workflow buttons on Publish for transitions when available.
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={form.author_is_team}
                onCheckedChange={(v) => setForm({ ...form, author_is_team: v === true })}
              />
              Credit as team author
            </label>
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Teachable
                tipId="create-continue"
                title={isNew ? "Create & continue" : "Save details"}
                body={
                  isNew
                    ? "Saves the module, then opens Chapters. You can still jump to any later step."
                    : "Updates title, slug, description, and cover without leaving this step."
                }
              >
                <Button onClick={saveOverview} disabled={saving}>
                  {saving ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : null}
                  {isNew ? "Create & continue" : "Save details"}
                </Button>
              </Teachable>
              {!isNew ? (
                <Button type="button" variant="outline" onClick={() => setStep("chapters")}>
                  Skip to chapters →
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {activeStep === "chapters" && detail ? (
        <Card>
          <CardHeader>
            <CardTitle>Chapters</CardTitle>
            <CardDescription>
              Each chapter becomes a learner step. Add at least one article when you can — optional for now.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {chapters.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-10 text-center">
                <ListOrdered className="size-8 text-muted-foreground/70" aria-hidden />
                <p className="text-sm font-medium">No chapters yet</p>
                <p className="max-w-sm text-xs text-muted-foreground">
                  Start with a short outline (e.g. “Intro”, “How the budget works”). You can reorder later.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {chapters.map((ch, idx) => (
                  <div key={ch.id} className="rounded-md border p-3 transition-colors hover:bg-muted/30">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-medium">
                        <span className="mr-2 text-muted-foreground">{idx + 1}.</span>
                        {ch.title}
                        <Badge variant="secondary" className="ml-2 text-[10px]">
                          {ch.articles?.length ?? 0} articles
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Move chapter up"
                          onClick={() => moveChapter(ch.id, -1)}
                        >
                          <ArrowUp className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Move chapter down"
                          onClick={() => moveChapter(ch.id, 1)}
                        >
                          <ArrowDown className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          className="text-destructive"
                          aria-label={`Delete chapter ${ch.title}`}
                          onClick={() => deleteChapter(ch)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                    {(ch.articles ?? []).length > 0 ? (
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {ch.articles!.map((a) => (
                          <li key={a.id}>
                            {a.title} <span className="capitalize">({a.state})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                        No article yet — learners need reading content on this step.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-end gap-2">
              <div className="space-y-1">
                <Label htmlFor="chapter-title" className="text-xs text-muted-foreground">
                  Chapter title
                </Label>
                <Input
                  id="chapter-title"
                  className="w-64 max-w-full"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  placeholder="e.g. How money is allocated"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void addChapter();
                    }
                  }}
                />
              </div>
              <Teachable
                tipId="add-chapter"
                title="Add chapter"
                body="Creates a learner step. Use arrows to reorder; delete removes it from the module."
              >
                <Button type="button" onClick={addChapter} disabled={saving || !chapterTitle.trim()}>
                  <Plus className="mr-1 size-3.5" />
                  Add chapter
                </Button>
              </Teachable>
            </div>
            <div className="space-y-2 border-t pt-4">
              <Label>Add article to a chapter</Label>
              <p className="text-xs text-muted-foreground">
                Creates a draft article and links it. You can flesh out the body later under Stories/Articles.
              </p>
              <div className="flex flex-wrap gap-2">
                <Select value={articleChapterId} onValueChange={setArticleChapterId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Choose chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="max-w-sm"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder="Article title"
                  disabled={!chapters.length}
                />
                <Teachable
                  tipId="link-article"
                  title="Link article"
                  body="Creates a draft article and attaches it to the selected chapter for the Learning Hub."
                >
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addArticleToChapter}
                    disabled={saving || !chapters.length}
                  >
                    Link article
                  </Button>
                </Teachable>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep("overview")}>
                ← Details
              </Button>
              <Button type="button" variant="outline" onClick={() => setStep("youtube")}>
                Continue to YouTube →
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {activeStep === "youtube" && detail ? (
        <Card>
          <CardHeader>
            <CardTitle>YouTube</CardTitle>
            <CardDescription>Optional. Skip if this module is text-first — you can return anytime.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {chapters.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-10 text-center">
                <Video className="size-8 text-muted-foreground/70" aria-hidden />
                <p className="text-sm font-medium">Add chapters first</p>
                <p className="max-w-sm text-xs text-muted-foreground">Videos attach to a chapter, not the module root.</p>
                <Button type="button" size="sm" variant="secondary" onClick={() => setStep("chapters")}>
                  Go to chapters
                </Button>
              </div>
            ) : (
              <>
                {chapters.map((ch) => {
                  const urls =
                    (ch.youtube_urls?.length ? ch.youtube_urls : ch.youtube_url ? [ch.youtube_url] : []) ?? [];
                  return (
                    <div key={ch.id} className="rounded-md border p-3">
                      <p className="font-medium">{ch.title}</p>
                      {urls.length ? (
                        <ul className="mt-2 space-y-1">
                          {urls.map((url, i) => (
                            <li key={`${url}-${i}`} className="flex items-center justify-between gap-2 text-sm">
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate text-primary underline-offset-2 hover:underline"
                              >
                                {url}
                              </a>
                              <Button
                                type="button"
                                size="icon-sm"
                                variant="ghost"
                                aria-label="Remove video"
                                onClick={() => removeYoutube(ch, i)}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1 text-xs text-muted-foreground">No videos on this chapter</p>
                      )}
                    </div>
                  );
                })}
                <div className="flex flex-wrap gap-2">
                  <Select value={youtubeChapterId} onValueChange={setYoutubeChapterId}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    className="max-w-md"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=…"
                  />
                  <Teachable
                    tipId="add-youtube"
                    title="Add YouTube URL"
                    body="Attaches a public YouTube link to the chapter. Sync videos under Media if you prefer picking from the library later."
                  >
                    <Button type="button" onClick={addYoutube} disabled={saving || !youtubeUrl.trim()}>
                      Add URL
                    </Button>
                  </Teachable>
                </div>
              </>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("chapters")}>
                ← Chapters
              </Button>
              <Button type="button" variant="outline" onClick={() => setStep("trivia")}>
                Continue to Trivia →
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {activeStep === "trivia" && detail ? (
        <Card>
          <CardHeader>
            <CardTitle>Trivia assessment</CardTitle>
            <CardDescription>
              Optional quiz for this module. The first question creates the assessment automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trivia ? (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium">{trivia.title}</span>
                <Badge variant="secondary" className="capitalize">
                  {trivia.status}
                </Badge>
                <span className="text-muted-foreground">{trivia.questions?.length ?? 0} questions</span>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                No assessment yet — add a question below when you are ready.
              </div>
            )}
            <div className="space-y-2">
              {(trivia?.questions ?? []).map((q, i) => (
                <div key={q.id} className="rounded-md border px-3 py-2 text-sm">
                  <span className="text-muted-foreground">{i + 1}. </span>
                  {q.question_text}
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t pt-4">
              <div className="space-y-2">
                <Label>Question</Label>
                <Textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={2}
                  placeholder="What should learners be able to answer?"
                />
              </div>
              <p className="text-xs text-muted-foreground">Select the radio next to the correct option.</p>
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={correctIndex === i}
                    onChange={() => setCorrectIndex(i)}
                    aria-label={`Mark option ${i + 1} correct`}
                  />
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = e.target.value;
                      setOptions(next);
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label>Explanation (optional)</Label>
                <Input
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Shown after the learner answers"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Teachable
                  tipId="add-question"
                  title="Add question"
                  body="Creates the module assessment on the first question, then appends more. Needs at least two options."
                >
                  <Button type="button" onClick={addQuestion} disabled={saving || !questionText.trim()}>
                    <Plus className="mr-1 size-3.5" />
                    Add question
                  </Button>
                </Teachable>
                {trivia && trivia.status !== "published" ? (
                  <Button type="button" variant="secondary" onClick={publishTrivia} disabled={saving}>
                    Publish trivia
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("youtube")}>
                ← YouTube
              </Button>
              <Button type="button" variant="outline" onClick={() => setStep("publish")}>
                Continue to Publish →
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {activeStep === "publish" && detail ? (
        <Card>
          <CardHeader>
            <CardTitle>Publish checklist</CardTitle>
            <CardDescription>
              Advisory only. Ship when citizens should see this on the Learning Hub.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              {MODULE_WIZARD_STEPS.filter((s) => s.key !== "publish").map((s) => (
                <li key={s.key} className="flex flex-wrap items-center gap-2 rounded-md border px-3 py-2">
                  <Badge variant={stepStatus[s.key].complete ? "default" : "secondary"}>
                    {stepStatus[s.key].complete ? "Ready" : "Optional gap"}
                  </Badge>
                  <button type="button" className="font-medium underline-offset-2 hover:underline" onClick={() => setStep(s.key)}>
                    {s.label}
                  </button>
                  <span className="text-muted-foreground">— {stepStatus[s.key].hint}</span>
                </li>
              ))}
            </ul>
            <Teachable
              tipId="workflow"
              title="Workflow buttons"
              body="Uses allowed transitions (submit review, publish, archive). Prefer these over forcing status on Overview."
              className="w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm">
                  Current status:{" "}
                  <Badge className="capitalize" variant={detail.status === "published" ? "default" : "secondary"}>
                    {detail.status}
                  </Badge>
                </span>
                {(detail.allowed_actions ?? []).map((action) => (
                  <Button key={action} type="button" size="sm" onClick={() => runTransition(action)} disabled={saving}>
                    {action.replace(/_/g, " ")}
                  </Button>
                ))}
                {(detail.allowed_actions ?? []).length === 0 ? (
                  <span className="text-xs text-muted-foreground">No workflow actions for your role right now.</span>
                ) : null}
              </div>
            </Teachable>
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setStep("trivia")}>
                ← Trivia
              </Button>
              <Button type="button" onClick={() => router.push(modulesHref)}>
                <BookOpen className="mr-1.5 size-3.5" />
                Back to module list
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
