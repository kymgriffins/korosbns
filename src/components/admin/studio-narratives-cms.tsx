"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { studiosEvidenceData } from "@/data/studios-evidence";
import {
  applyDraftToProject,
  resolveCmsProject,
  studioCmsData,
  type StudioNarrativeDraft,
} from "@/data/studio-cms";
import {
  NARRATIVE_BY_CONTENT_TYPE,
  validateStudioProject,
  type LawViolation,
} from "@/lib/studio-content-laws";
import { cn } from "@/utils";

function StringListEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {values.map((value, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Remove item ${i + 1}`}
            onClick={() => onChange(values.filter((_, j) => j !== i))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => onChange([...values, ""])}
      >
        <Plus className="size-3.5" /> Add
      </Button>
    </div>
  );
}

function PairListEditor({
  label,
  pairs,
  onChange,
  leftLabel,
  rightLabel,
}: {
  label: string;
  pairs: { left: string; right: string }[];
  onChange: (next: { left: string; right: string }[]) => void;
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {pairs.map((pair, i) => (
        <div key={i} className="grid gap-2 rounded-xl border border-border/50 p-3 sm:grid-cols-[1fr_1fr_auto]">
          <Input
            value={pair.left}
            placeholder={leftLabel}
            aria-label={`${leftLabel} ${i + 1}`}
            onChange={(e) => {
              const next = [...pairs];
              next[i] = { ...pair, left: e.target.value };
              onChange(next);
            }}
          />
          <Input
            value={pair.right}
            placeholder={rightLabel}
            aria-label={`${rightLabel} ${i + 1}`}
            onChange={(e) => {
              const next = [...pairs];
              next[i] = { ...pair, right: e.target.value };
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Remove row ${i + 1}`}
            onClick={() => onChange(pairs.filter((_, j) => j !== i))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => onChange([...pairs, { left: "", right: "" }])}
      >
        <Plus className="size-3.5" /> Add
      </Button>
    </div>
  );
}

export function StudioNarrativesCms() {
  const projects = useMemo(() => studiosEvidenceData.getAllProjects(), []);
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? "");
  const [draft, setDraft] = useState<StudioNarrativeDraft>({ slug: selectedSlug });
  const [draftedSlugs, setDraftedSlugs] = useState<string[]>([]);
  const [savedTick, setSavedTick] = useState(0);

  const base = projects.find((p) => p.slug === selectedSlug);
  const kind = base ? NARRATIVE_BY_CONTENT_TYPE[base.contentType] : null;

  useEffect(() => {
    setDraftedSlugs(Object.keys(studioCmsData.drafts.get()));
  }, [savedTick, selectedSlug]);

  useEffect(() => {
    const existing = studioCmsData.drafts.getBySlug(selectedSlug);
    setDraft(existing ? { ...existing } : { slug: selectedSlug });
  }, [selectedSlug]);

  const preview = useMemo(() => {
    if (!base) return null;
    return applyDraftToProject(base, { ...draft, slug: selectedSlug });
  }, [base, draft, selectedSlug]);

  const violations: LawViolation[] = useMemo(
    () => (preview && base ? validateStudioProject(preview) : []),
    [preview, base],
  );

  if (!base || !preview || !kind) return null;

  const set = <K extends keyof StudioNarrativeDraft>(key: K, value: StudioNarrativeDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const details = draft.formatDetails ?? {};

  const setChapters = (pairs: { left: string; right: string }[]) =>
    set("formatDetails", {
      ...details,
      chapters: pairs
        .filter((p) => p.left.trim())
        .map((p) => ({
          title: p.left.trim(),
          ...(p.right.trim() ? { note: p.right.trim() } : {}),
        })),
    });

  const setFindings = (pairs: { left: string; right: string }[]) =>
    set("formatDetails", {
      ...details,
      findings: pairs
        .filter((p) => p.left.trim())
        .map((p) => ({
          title: p.left.trim(),
          ...(p.right.trim() ? { detail: p.right.trim() } : {}),
        })),
    });

  const setAgenda = (pairs: { left: string; right: string }[]) =>
    set("formatDetails", {
      ...details,
      agenda: pairs
        .filter((p) => p.left.trim())
        .map((p) => ({
          title: p.left.trim(),
          ...(p.right.trim() ? { detail: p.right.trim() } : {}),
        })),
    });

  const save = () => {
    studioCmsData.drafts.save({ ...draft, slug: selectedSlug });
    setSavedTick((t) => t + 1);
  };

  const discard = () => {
    studioCmsData.drafts.discard(selectedSlug);
    setDraft({ slug: selectedSlug });
    setSavedTick((t) => t + 1);
  };

  const exportJson = () => {
    const blob = new Blob([studioCmsData.io.exportSeedPatch()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "studio-narratives-seed-patch.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const lawStatus = (slug: string) => {
    const resolved = resolveCmsProject(slug);
    if (!resolved) return 0;
    return validateStudioProject(resolved).length;
  };

  return (
    <div className="grid gap-6 p-6 lg:grid-cols-[16rem_1fr]">
      <aside className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Narratives · {projects.length}
          </h2>
          <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={exportJson}>
            <Download className="size-3.5" /> Export
          </Button>
        </div>
        {projects.map((project) => {
          const count = lawStatus(project.slug);
          const hasDraft = draftedSlugs.includes(project.slug);
          return (
            <button
              key={project.slug}
              type="button"
              onClick={() => setSelectedSlug(project.slug)}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors",
                selectedSlug === project.slug
                  ? "border-primary/60 bg-primary/5"
                  : "border-border/50 hover:bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  count === 0 ? "bg-green-500" : "bg-amber-500",
                )}
                title={count === 0 ? "Complies with content laws" : `${count} law violations`}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {project.title}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {NARRATIVE_BY_CONTENT_TYPE[project.contentType]}
                  {hasDraft ? " · draft" : ""}
                </span>
              </span>
            </button>
          );
        })}
      </aside>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Pencil className="size-4 text-muted-foreground" />
              <h1 className="text-xl font-extrabold tracking-tight">{base.title}</h1>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Narrative: <Badge variant="outline">{kind}</Badge> · {base.contentType} ·{" "}
              <Link
                href={`/bns-studio/${base.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Preview live <ExternalLink className="size-3" />
              </Link>
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="gap-1.5" onClick={discard}>
              <RotateCcw className="size-4" /> Discard draft
            </Button>
            <Button type="button" className="gap-1.5" onClick={save}>
              Save draft
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "rounded-2xl border p-4",
            violations.length === 0
              ? "border-green-500/40 bg-green-500/5"
              : "border-amber-500/40 bg-amber-500/5",
          )}
          role="status"
        >
          <p className="flex items-center gap-2 text-sm font-bold">
            {violations.length === 0 ? (
              <>
                <CheckCircle2 className="size-4 text-green-600" />
                Complies with all content laws
              </>
            ) : (
              <>
                <AlertTriangle className="size-4 text-amber-600" />
                {violations.length} law violation{violations.length === 1 ? "" : "s"}
              </>
            )}
          </p>
          {violations.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs">
              {violations.map((v, i) => (
                <li key={i}>
                  <span className="font-mono font-bold">{v.law}</span>
                  <span className="text-muted-foreground"> · {v.field} — {v.message}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="grid gap-5 rounded-2xl border border-border/50 p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Copy
          </h2>
          <div className="space-y-2">
            <Label htmlFor="cms-title">Title</Label>
            <Input
              id="cms-title"
              value={draft.title ?? ""}
              placeholder={base.title}
              onChange={(e) => set("title", e.target.value || undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cms-subtitle">Subtitle</Label>
            <Input
              id="cms-subtitle"
              value={draft.subtitle ?? ""}
              placeholder={base.subtitle ?? "Subtitle"}
              onChange={(e) => set("subtitle", e.target.value || undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cms-brief">Brief / challenge</Label>
            <Textarea
              id="cms-brief"
              rows={3}
              value={draft.briefChallenge ?? ""}
              placeholder={base.briefChallenge}
              onChange={(e) => set("briefChallenge", e.target.value || undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cms-produced">What we produced</Label>
            <Textarea
              id="cms-produced"
              rows={3}
              value={draft.whatWeProduced ?? ""}
              placeholder={base.whatWeProduced}
              onChange={(e) => set("whatWeProduced", e.target.value || undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cms-desc">Description</Label>
            <Textarea
              id="cms-desc"
              rows={4}
              value={draft.description ?? ""}
              placeholder={base.description}
              onChange={(e) => set("description", e.target.value || undefined)}
            />
          </div>
          <StringListEditor
            label="Outputs (episodes / chapters / deliverables)"
            values={draft.outputs ?? [...base.outputs]}
            placeholder="e.g. 12-minute flagship explainer"
            onChange={(outputs) => set("outputs", outputs)}
          />
          <StringListEditor
            label="Tags"
            values={draft.tags ?? [...base.tags]}
            placeholder="e.g. national-budget"
            onChange={(tags) => set("tags", tags)}
          />
        </div>

        <div className="grid gap-5 rounded-2xl border border-border/50 p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Impact
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cms-metric">Primary metric</Label>
              <Input
                id="cms-metric"
                value={draft.primaryMetric ?? ""}
                placeholder={base.impactEvidence.primaryMetric ?? "e.g. 480K+ views in 90 days"}
                onChange={(e) => set("primaryMetric", e.target.value || undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cms-metric2">Secondary metric</Label>
              <Input
                id="cms-metric2"
                value={draft.secondaryMetric ?? ""}
                placeholder={base.impactEvidence.secondaryMetric ?? "Optional"}
                onChange={(e) => set("secondaryMetric", e.target.value || undefined)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cms-context">Impact context</Label>
            <Textarea
              id="cms-context"
              rows={2}
              value={draft.impactContext ?? ""}
              placeholder={base.impactEvidence.context}
              onChange={(e) => set("impactContext", e.target.value || undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cms-verify">Verification note</Label>
            <Input
              id="cms-verify"
              value={draft.verificationOutcome ?? ""}
              placeholder={base.impactEvidence.verificationOutcome ?? "How numbers were verified"}
              onChange={(e) => set("verificationOutcome", e.target.value || undefined)}
            />
          </div>
        </div>

        <div className="grid gap-5 rounded-2xl border border-border/50 p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Narrative structures · {kind}
          </h2>
          {(kind === "season" || kind === "explainer" || kind === "reel-feed") && (
            <PairListEditor
              label="Chapters / episodes (title + note)"
              pairs={(details.chapters ?? []).map((c) => ({ left: c.title, right: c.note ?? "" }))}
              leftLabel="Chapter title"
              rightLabel="Note (optional)"
              onChange={setChapters}
            />
          )}
          {(kind === "dossier" || kind === "listening") && (
            <PairListEditor
              label="Findings (title + detail)"
              pairs={(details.findings ?? []).map((f) => ({ left: f.title, right: f.detail ?? "" }))}
              leftLabel="Finding"
              rightLabel="Detail (optional)"
              onChange={setFindings}
            />
          )}
          {kind === "convening" && (
            <PairListEditor
              label="Agenda (session + detail)"
              pairs={(details.agenda ?? []).map((a) => ({ left: a.title, right: a.detail ?? "" }))}
              leftLabel="Session"
              rightLabel="Detail (optional)"
              onChange={setAgenda}
            />
          )}
          {(kind === "listening" || kind === "film") && (
            <PairListEditor
              label="Voices (quote + name · role)"
              pairs={(details.voices ?? []).map((v) => ({
                left: v.quote,
                right: [v.name, v.role].filter(Boolean).join(" · "),
              }))}
              leftLabel="Quote (real words only)"
              rightLabel="Name · role"
              onChange={(pairs) =>
                set("formatDetails", {
                  ...details,
                  voices: pairs
                    .filter((p) => p.left.trim() && p.right.trim())
                    .map((p) => {
                      const [name = "", ...roleParts] = p.right.split("·").map((s) => s.trim());
                      return {
                        quote: p.left.trim(),
                        name: name.trim(),
                        ...(roleParts.length ? { role: roleParts.join(" · ") } : {}),
                      };
                    }),
                })
              }
            />
          )}
          {kind === "film" && (
            <PairListEditor
              label="Credits (role + name)"
              pairs={(details.credits ?? []).map((c) => ({ left: c.role, right: c.name }))}
              leftLabel="Role"
              rightLabel="Name"
              onChange={(pairs) =>
                set("formatDetails", {
                  ...details,
                  credits: pairs
                    .filter((p) => p.left.trim() && p.right.trim())
                    .map((p) => ({ role: p.left.trim(), name: p.right.trim() })),
                })
              }
            />
          )}
          {kind === "motion" && (
            <p className="text-xs text-muted-foreground">
              Motion pieces use the outputs list as deliverables and the four-stage
              pipeline (Script → Storyboard → Animate → Sound). No extra structures
              required by law.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
