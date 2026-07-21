"use client";

import { useMemo, useState } from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FyEpisode } from "@/lib/budget-episodes";
import { episodeVerificationBadge } from "@/lib/budget-episodes";
import { formatKesBillions, formatKesTrillions } from "@/lib/budget-format";
import { cn } from "@/utils";
import { BriefAmount, ChapterIntro } from "./brief-primitives";
import { ChartExportButtons } from "./chart-export-buttons";
import { CountyLensPanel } from "./county-lens-panel";
import { ImpactSimulatorPanel } from "./impact-simulator-panel";

const SECTOR_COLORS = [
  "hsl(221 83% 53%)",
  "hsl(142 76% 36%)",
  "hsl(24 95% 53%)",
  "hsl(173 80% 40%)",
  "hsl(346 77% 50%)",
  "hsl(47 95% 48%)",
  "hsl(262 52% 47%)",
];

function formatMetricBillions(value: number): string {
  if (value >= 1000) return formatKesTrillions(value);
  return formatKesBillions(value, { prefix: true });
}

export function FyEpisodePanel({ episode }: { episode: FyEpisode }) {
  const m = episode.metrics;
  const badge = episodeVerificationBadge(episode);
  const [lens, setLens] = useState<"citizen" | "economist">("citizen");

  const splitData = [
    m.recurrent_billions != null
      ? { name: "Recurrent", value: m.recurrent_billions, fill: "hsl(221 83% 53%)" }
      : null,
    m.development_billions != null
      ? { name: "Development", value: m.development_billions, fill: "hsl(24 95% 53%)" }
      : null,
  ].filter(Boolean) as { name: string; value: number; fill: string }[];

  const sectorData = episode.top_sectors.map((s) => ({
    name: s.name,
    value: s.value_billions,
  }));

  const educationBillions = useMemo(
    () => episode.top_sectors.find((s) => /education/i.test(s.name))?.value_billions ?? 0,
    [episode.top_sectors],
  );
  const healthBillions = useMemo(
    () => episode.top_sectors.find((s) => /health/i.test(s.name))?.value_billions ?? 0,
    [episode.top_sectors],
  );

  return (
    <div className="space-y-6">
      <ChapterIntro
        eyebrow={`FY ${episode.fy} episode`}
        title="Budget Data World"
        description={episode.synopsis}
      />

      <div
        className="flex gap-1 rounded-2xl bg-muted/50 p-1"
        role="tablist"
        aria-label="Report lens"
      >
        {(
          [
            { id: "citizen" as const, label: "Citizen" },
            { id: "economist" as const, label: "Economist" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={lens === tab.id}
            onClick={() => setLens(tab.id)}
            className={cn(
              "flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-colors",
              lens === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero: theme + chips */}
      <div className="rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-background p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
            Level-{episode.provenance_level} provenance
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">
            <ShieldCheck className="size-3" aria-hidden />
            {badge}
          </span>
        </div>
        <p className="mt-3 text-xs font-semibold text-muted-foreground">Budget theme</p>
        <p className="mt-1.5 font-heading text-lg font-semibold leading-snug">{episode.theme}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Presented by {episode.presented_by}
          {episode.presented_date ? ` · ${episode.presented_date}` : ""}
          {episode.seed_key ? ` · seed ${episode.seed_key}` : ""}
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "Expenditure", value: m.total_expenditure_billions },
          { label: "Revenue", value: m.total_revenue_billions },
          {
            label: "Deficit",
            value: m.deficit_billions,
            sub: `${m.deficit_gdp_pct}% of GDP`,
          },
        ].map((tile) => (
          <div
            key={tile.label}
            className="rounded-2xl border border-border/40 bg-card/80 p-3.5 backdrop-blur-sm"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {tile.label}
            </p>
            <p className="mt-1 text-base font-bold tabular-nums sm:text-lg">
              {formatMetricBillions(tile.value)}
            </p>
            {"sub" in tile && tile.sub ? (
              <p className="mt-0.5 text-[10px] text-muted-foreground">{tile.sub}</p>
            ) : null}
          </div>
        ))}
      </div>

      {/* Recurrent vs development */}
      {splitData.length > 0 ? (
        <section className="rounded-3xl border border-border/50 bg-card/60 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-heading text-sm font-bold">Recurrent vs development</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                From seed expenditure split — figures in billions KES.
              </p>
            </div>
            <ChartExportButtons
              label="Recurrent vs development"
              fileBase={`fy-${episode.fy.replace("/", "-")}-recurrent-dev`}
            />
          </div>
          <div className="mt-4 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={splitData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                >
                  {splitData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    formatKesBillions(typeof value === "number" ? value : Number(value), {
                      prefix: true,
                    })
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-1 flex flex-wrap justify-center gap-4 text-xs">
            {splitData.map((d) => (
              <li key={d.name} className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: d.fill }}
                  aria-hidden
                />
                <span className="font-medium">{d.name}</span>
                <span className="tabular-nums text-muted-foreground">
                  {formatKesBillions(d.value, { prefix: false })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Top sectors */}
      <section className="rounded-3xl border border-border/50 bg-card/60 p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="font-heading text-sm font-bold">Top sectors</h3>
            <p className="mt-1 text-xs text-muted-foreground">Largest allocations (KES billions)</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <BriefAmount
              billions={m.total_expenditure_billions}
              className="text-base text-muted-foreground"
            />
            <ChartExportButtons
              label="Top sectors"
              fileBase={`fy-${episode.fy.replace("/", "-")}-sectors`}
            />
          </div>
        </div>
        <div className="mt-4 h-56 w-full sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sectorData}
              layout="vertical"
              margin={{ left: 4, right: 12, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.3} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={88}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                formatter={(value) =>
                  formatKesBillions(typeof value === "number" ? value : Number(value), {
                    prefix: true,
                  })
                }
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                {sectorData.map((_, i) => (
                  <Cell key={sectorData[i].name} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Citizen impact — cited seed blurbs only */}
      {lens === "citizen" && episode.citizen_impact ? (
        <section className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
          <h3 className="font-heading text-sm font-bold">{episode.citizen_impact.title}</h3>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800/80 dark:text-amber-300/80">
            {episode.citizen_impact.source_note}
          </p>
          <ul className="mt-4 space-y-3">
            {episode.citizen_impact.blurbs.map((b) => (
              <li
                key={b.title}
                className="rounded-2xl border border-border/40 bg-background/70 p-3.5"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {b.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{b.text}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lens === "economist" ? (
        <section className="rounded-3xl border border-border/50 bg-muted/20 p-4 sm:p-5">
          <h3 className="font-heading text-sm font-bold">Economist read</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Macro split and sector ranking from the same Level-1 seed — no secondary KPIs invented.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Deficit / GDP
              </dt>
              <dd className="mt-1 font-bold tabular-nums">{m.deficit_gdp_pct}%</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Debt interest
              </dt>
              <dd className="mt-1 font-bold tabular-nums">
                {m.debt_interest_billions != null
                  ? formatKesBillions(m.debt_interest_billions, { prefix: true })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Recurrent
              </dt>
              <dd className="mt-1 font-bold tabular-nums">
                {m.recurrent_billions != null
                  ? formatKesBillions(m.recurrent_billions, { prefix: true })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Development
              </dt>
              <dd className="mt-1 font-bold tabular-nums">
                {m.development_billions != null
                  ? formatKesBillions(m.development_billions, { prefix: true })
                  : "—"}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      {lens === "citizen" && educationBillions > 0 && healthBillions > 0 ? (
        <ImpactSimulatorPanel
          fiscalYear={episode.fy}
          totalExpenditureBillions={m.total_expenditure_billions}
          educationBillions={educationBillions}
          healthBillions={healthBillions}
        />
      ) : null}

      <CountyLensPanel fiscalYear={episode.fy} />

      {/* Document links from provenance */}
      <section className="space-y-3">
        <h3 className="font-heading text-sm font-bold">Source documents</h3>
        <ul className="space-y-2">
          {episode.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 rounded-2xl border border-border/40 bg-muted/30 px-3.5 py-3 text-sm transition-colors hover:bg-muted/60"
              >
                <span>
                  <span className="font-semibold text-foreground">{s.name}</span>
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">{s.org}</span>
                </span>
                <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
