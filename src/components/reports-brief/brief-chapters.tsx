"use client";

import type { ReportsBriefModel, BriefChapterId } from "@/lib/reports-brief";
import { BriefCard, BriefAmount, ChapterIntro } from "./brief-primitives";
import { formatKesBillions } from "@/lib/budget-format";

function PulseChapter({ model }: { model: ReportsBriefModel }) {
  return (
    <div className="space-y-5">
      <ChapterIntro
        eyebrow={`FY ${model.fiscalYear}`}
        title="National pulse"
        description="One screen to orient yourself before diving into sectors."
      />

      <div className="rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-background p-5 sm:p-6">
        <p className="text-xs font-semibold text-muted-foreground">Budget theme</p>
        <p className="mt-2 font-heading text-lg font-semibold leading-snug">{model.theme}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Presented by {model.presentedBy}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "National spend", value: model.totalNationalBillions },
          { label: "Revenue plan", value: model.totalRevenueBillions },
          { label: "County share", value: model.devolutionBillions },
          { label: "Fiscal gap", value: model.deficitBillions },
        ].map((tile) => (
          <div
            key={tile.label}
            className="rounded-2xl border border-border/40 bg-card/80 p-3.5 backdrop-blur-sm"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {tile.label}
            </p>
            <p className="mt-1 text-lg font-bold tabular-nums">
              {formatKesBillions(tile.value, { prefix: false })}
            </p>
          </div>
        ))}
      </div>

      <BriefCard brief={model.pulse} defaultOpen />
    </div>
  );
}

function SingleBriefChapter({
  brief,
  eyebrow,
  title,
  description,
}: {
  brief: ReportsBriefModel["revenue"];
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-5">
      <ChapterIntro eyebrow={eyebrow} title={title} description={description} />
      <BriefCard brief={brief} defaultOpen />
    </div>
  );
}

function SectorsChapter({ model }: { model: ReportsBriefModel }) {
  return (
    <div className="space-y-5">
      <ChapterIntro
        eyebrow="National sectors"
        title={`${model.sectors.length} spending categories`}
        description="Each card opens to a plain-language summary, citizen takeaway, and top vote lines — inspired by category breakdowns in Monzo and Our World in Data."
      />
      <div className="space-y-3">
        {model.sectors.map((sector, i) => (
          <BriefCard key={sector.id} brief={sector} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}

function ProjectsChapter({ model }: { model: ReportsBriefModel }) {
  if (!model.projects.length) {
    return (
      <div className="space-y-4 py-8 text-center">
        <ChapterIntro
          eyebrow="Ward projects"
          title="No project snapshots yet"
          description="When the API publishes ward-level project tracking, they will appear here as neighbourhood briefs."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ChapterIntro
        eyebrow="Ward projects"
        title="Neighbourhood delivery"
        description="Ground-truth checks — allocated vs released vs spent."
      />
      <div className="space-y-3">
        {model.projects.map((p) => (
          <BriefCard key={p.id} brief={p} defaultOpen={model.projects.length === 1} />
        ))}
      </div>
    </div>
  );
}

export function BriefChapterPanel({
  chapter,
  model,
}: {
  chapter: BriefChapterId;
  model: ReportsBriefModel;
}) {
  switch (chapter) {
    case "pulse":
      return <PulseChapter model={model} />;
    case "revenue":
      return (
        <SingleBriefChapter
          brief={model.revenue}
          eyebrow="Income"
          title="Where the money comes from"
          description="Revenue streams before a single shilling is spent."
        />
      );
    case "debt":
      return (
        <SingleBriefChapter
          brief={model.debt}
          eyebrow="Borrowing"
          title="Gap, debt & risks"
          description={`Deficit at ${model.deficitGdpPct}% of GDP — what fills the hole.`}
        />
      );
    case "sectors":
      return <SectorsChapter model={model} />;
    case "counties":
      return (
        <SingleBriefChapter
          brief={model.counties}
          eyebrow="Devolution"
          title="County envelope"
          description="How national conditional grants stack on equitable share."
        />
      );
    case "projects":
      return <ProjectsChapter model={model} />;
    default:
      return null;
  }
}

export function BriefHeroStats({ model }: { model: ReportsBriefModel }) {
  return (
    <div className="flex items-end justify-between gap-3 border-b border-border/40 pb-4">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Budget brief
        </p>
        <p className="truncate font-heading text-sm font-bold">FY {model.fiscalYear}</p>
      </div>
      <div className="text-right">
        <BriefAmount billions={model.totalNationalBillions} className="text-xl" />
        <p className="text-[10px] text-muted-foreground">national sectors</p>
      </div>
    </div>
  );
}
