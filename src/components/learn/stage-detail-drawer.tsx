"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, PlayCircle, CheckCircle2, ChevronDown, Clock, BookOpen, Star, BookOpenText, Video, Brain, Loader2 } from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { learnHubApi } from "@/lib/learn-hub";
import { useLearn } from "@/contexts/learn-context";
import { useSidebar } from "@/ui/sidebar";
import { readProgress, writeProgress } from "@/lib/module-progress";
import { triviaForStep } from "@/lib/learn-trivia";
import { certificateDownloadHref } from "@/lib/certificate-url";
import type { CivicModule, ChapterStep, ChapterVideo } from "@/types/learn";
import {
  fetchBudgetAllocations,
  fetchBudgetKpis,
  fetchBudgetHighlights,
  allocationsToChartPoints,
  kpiRawToKpi,
  allocationToComparisonRows,
  highlightRawToCallout,
  type BudgetAllocation,
  type BudgetKpiRaw,
  type BudgetHighlightRaw,
} from "@/lib/budget-api";
import {
  BudgetModuleReportOverview,
  BudgetKpiGrid,
  BudgetBarChart,
  BudgetComparisonTable,
  BudgetCalloutCard,
} from "@/components/budget-news/report-blocks";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/ui/chart";
import {
  Pie as RePie,
  PieChart as RePieChart,
  Label as ReLabel,
  Cell as ReCell,
} from "recharts";
import { shareOfTotal, formatKesBillions } from "@/lib/budget-format";
import type {
  BudgetReportProfile,
  ChapterReportData,
} from "@/types/budget-report";

import { StepContent } from "./step-content";
import { TriviaSection } from "./trivia-section";
import { MasteryPage } from "./mastery-page";

// ── Inline budget components (interleaved within the article flow) ──

function BudgetInlineSnapshot({ report }: { report: ChapterReportData }) {
  if (!report.kpis?.length) return null;
  return (
    <div className="rounded-xl border border-primary/10 bg-gradient-to-r from-primary/5 to-transparent p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-primary" />
        Sector at a glance
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {report.kpis.map((kpi) => (
          <div key={kpi.key} className="text-xs">
            <span className="text-muted-foreground">{kpi.label}: </span>
            <span className="font-semibold tabular-nums">
              {kpi.suffix === "trillion-scale"
                ? `KES ${(kpi.value / 1000).toFixed(2)}T`
                : `KES ${kpi.value.toFixed(1)}B`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetInlineDeepDive({ report }: { report: ChapterReportData }) {
  const hasData = report.chart?.data?.length || report.comparison_rows?.length || report.callouts?.length;
  if (!hasData) return null;
  return (
    <div className="space-y-5 pt-2 border-t border-border/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-primary" />
        Data deep dive
      </p>
      {report.chart?.data?.length ? (
        report.chart.type === "pie" ? (
          <BudgetPieChartInline config={report.chart} />
        ) : (
          <BudgetBarChart config={report.chart} />
        )
      ) : null}
      {report.comparison_rows?.length ? (
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Year-over-Year</h5>
          <BudgetComparisonTable rows={report.comparison_rows} />
        </div>
      ) : null}
      {report.callouts?.length ? (
        <div className="grid gap-3">
          {report.callouts.map((callout, i) => (
            <BudgetCalloutCard key={callout.title} callout={callout} index={i} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const INLINE_COLORS = [
  "hsl(221 83% 53%)",
  "hsl(262 83% 58%)",
  "hsl(142 76% 36%)",
  "hsl(24 95% 53%)",
  "hsl(346 77% 50%)",
  "hsl(173 80% 40%)",
];

function BudgetPieChartInline({ config }: { config: { title: string; data: Array<{ name: string; value: number; fill?: string }>; valueLabel?: string } }) {
  const localChartConfig: ChartConfig = Object.fromEntries(
    config.data.map((d, i) => [
      d.name,
      { label: d.name, color: d.fill ?? INLINE_COLORS[i % INLINE_COLORS.length] },
    ]),
  );
  const total = config.data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="rounded-xl border border-border/60 py-4">
      <div className="px-4 pb-2">
        <h4 className="text-sm font-semibold">{config.title}</h4>
      </div>
      <ChartContainer config={localChartConfig} className="h-[200px] sm:h-[240px] w-full aspect-auto">
        <RePieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value: any, name: any) => [
                  `${formatKesBillions(Number(value), { prefix: false })} (${shareOfTotal(Number(value), total)})`,
                  String(name),
                ]}
              />
            }
          />
          <RePie
            data={config.data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="80%"
            paddingAngle={2}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {config.data.map((entry, index) => (
              <ReCell
                key={entry.name}
                fill={entry.fill ?? INLINE_COLORS[index % INLINE_COLORS.length]}
                stroke="transparent"
              />
            ))}
            <ReLabel content={<PieCenterLabelInline total={total} label="Total" />} position="center" />
          </RePie>
        </RePieChart>
      </ChartContainer>
      <div className="mt-2 px-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {config.data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="size-2 rounded-full shrink-0" style={{ background: d.fill ?? INLINE_COLORS[i % INLINE_COLORS.length] }} />
            <span className="truncate text-muted-foreground flex-1">{d.name}</span>
            <span className="tabular-nums font-medium">{d.value.toFixed(1)}B</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieCenterLabelInline({ total, label }: { total: number; label: string }) {
  return (
    <text textAnchor="middle" dominantBaseline="middle" className="fill-foreground">
      <tspan x={0} dy={-6} className="fill-muted-foreground text-[10px]">{label}</tspan>
      <tspan x={0} dy={18} className="font-bold text-sm tabular-nums">
        {total.toFixed(1)}B
      </tspan>
    </text>
  );
}

interface StageDetailDrawerProps {
  stage: CivicModule;
  profile: any;
  onClose: () => void;
  onUpdateProfile: (updatedProfile: any) => void;
  onPrevStage?: () => void;
  onNextStage?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function StageDetailDrawer({
  stage, profile, onClose, onUpdateProfile, onPrevStage, onNextStage, hasPrev, hasNext
}: StageDetailDrawerProps) {
  const { totalStages } = useLearn();
  const { setOpen: setSidebarOpen, open: sidebarOpen } = useSidebar();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"read" | "watch" | "quiz">("read");
  const [showTrivia, setShowTrivia] = useState<boolean>(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);

  // ── Budget data (for financial_year_analysis modules) ──
  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[] | null>(null);
  const [budgetKpis, setBudgetKpis] = useState<BudgetKpiRaw[] | null>(null);
  const [budgetHighlights, setBudgetHighlights] = useState<BudgetHighlightRaw[] | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(false);

  const isBudgetModule = stage.is_financial_year_analysis === true;

  useEffect(() => {
    if (!isBudgetModule || !stage.fiscal_year_id) return;
    let cancelled = false;
    setBudgetLoading(true);
    async function loadBudget() {
      try {
        const [allocations, kpis, highlights] = await Promise.all([
          fetchBudgetAllocations({ fiscal_year: stage.fiscal_year_id! }),
          fetchBudgetKpis({ fiscal_year: stage.fiscal_year_id! }),
          fetchBudgetHighlights({ fiscal_year: stage.fiscal_year_id! }),
        ]);
        if (cancelled) return;
        setBudgetAllocations(allocations);
        setBudgetKpis(kpis);
        setBudgetHighlights(highlights);
      } catch {
        // silently fail — fall back to JSON metadata
      } finally {
        if (!cancelled) setBudgetLoading(false);
      }
    }
    loadBudget();
    return () => { cancelled = true; };
  }, [isBudgetModule, stage.fiscal_year_id]);

  const budgetReportProfile = useMemo<BudgetReportProfile | null>(() => {
    if (!budgetAllocations) return null;
    const approved = budgetAllocations.filter((a) => a.allocation_type === "approved");
    const proposed = budgetAllocations.filter((a) => a.allocation_type === "proposed");
    const sectorChart = allocationsToChartPoints(approved, "approved");
    const comparisonRows = allocationToComparisonRows(budgetAllocations);
    const kpis = budgetKpis?.map(kpiRawToKpi);
    const highlights = budgetHighlights?.map(highlightRawToCallout);
    return {
      fiscal_year: stage.fiscal_year_label || String(stage.fiscal_year_id),
      kpis,
      sector_chart: sectorChart,
      comparison_rows: comparisonRows,
      highlights,
    };
  }, [budgetAllocations, budgetKpis, budgetHighlights, stage.fiscal_year_label, stage.fiscal_year_id]);

  function getChapterReport(step: ChapterStep | null): ChapterReportData | null {
    if (!step?.budget_entity_id || !budgetAllocations) return null;
    const entityAllocs = budgetAllocations.filter((a) => a.entity === step.budget_entity_id);
    const entityKpis = budgetKpis?.filter((k) => k.entity === step.budget_entity_id).map(kpiRawToKpi);
    const entityHighlights = budgetHighlights?.filter((h) => h.entity === step.budget_entity_id).map(highlightRawToCallout);
    const approvedPoints = allocationsToChartPoints(entityAllocs, "approved");
    const comparisonRows = allocationToComparisonRows(entityAllocs);
    return {
      kpis: entityKpis,
      chart: approvedPoints.length
        ? { type: "bar", title: step.budget_entity_name || "Sector Allocation", data: approvedPoints, valueLabel: "KES Bn" }
        : undefined,
      comparison_rows: comparisonRows,
      callouts: entityHighlights,
    };
  }

  useEffect(() => {
    const moduleProgress = readProgress(stage.slug, stage.order);
    const initialStep = moduleProgress.currentStep || 1;
    setCurrentStep(initialStep);
    setExpandedStep(initialStep);
  }, [stage.slug, stage.order]);

  useEffect(() => {
    setSidebarOpen(false);
    return () => setSidebarOpen(true);
  }, []);

  const isStepTriviaPassed = (stepId: number) => {
    return readProgress(stage.slug, stage.order).stepsCompleted[stepId] === true;
  };

  const handleCorrectAnswer = (qIdx: number) => {
    const step = stage.steps[currentStep - 1];
    const rewardTag = `${step.order}_${qIdx}`;
    const p = readProgress(stage.slug, stage.order);
    if (!p.triviaRewards.includes(rewardTag)) {
      writeProgress(stage.slug, { ...p, triviaRewards: [...p.triviaRewards, rewardTag] });
      const updated = { ...profile, sovereigns: profile.sovereigns + 5 };
      onUpdateProfile(updated);
      toast.success("Correct! +5 SVG!");
    } else {
      toast.success("Correct!");
    }
  };

  const handleFinishTrivia = () => {
    const step = stage.steps[currentStep - 1];
    const p = readProgress(stage.slug, stage.order);
    writeProgress(stage.slug, {
      ...p,
      stepsCompleted: { ...p.stepsCompleted, [step.order]: true },
      currentStep: currentStep + 1
    });
    toast.success("Knowledge Check complete!");
    learnHubApi.completeChapter(step.id).catch(() => {
      // server recording failed silently
    });
    setCurrentStep((prev) => prev + 1);
    setExpandedStep((prev) => (prev ? prev + 1 : null));
    setShowTrivia(false);
  };

  useEffect(() => {
    if (activeTab === "quiz" && triviaForStep(stage, stage.steps[currentStep - 1], currentStep - 1).length === 0) {
      setActiveTab("read");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, activeTab]);

  useEffect(() => {
    if (currentStep === stage.steps.length + 1) {
      const p = readProgress(stage.slug, stage.order);
      if (!p.masteryAwarded) {
        writeProgress(stage.slug, { ...p, masteryAwarded: true });
        const newProgress = profile.stageProgress ? [...profile.stageProgress] : [1];
        const nextStageId = stage.order + 1;
        if (nextStageId <= totalStages && !newProgress.includes(nextStageId)) {
          newProgress.push(nextStageId);
        }
        const newBadges = profile.badges ? [...profile.badges] : [];
        if (!newBadges.includes(stage.badge)) {
          newBadges.push(stage.badge);
        }
        const updatedProfile = {
          ...profile,
          sovereigns: profile.sovereigns + 25,
          stageProgress: newProgress,
          badges: newBadges,
        };
        onUpdateProfile(updatedProfile);
        learnHubApi.markProgress({ content_type: "path", content_id: stage.id, progress_percent: 100 }).catch(() => {
          // server progress marking failed silently
        });
        const lastStep = stage.steps[stage.steps.length - 1];
        if (lastStep) {
          learnHubApi.completeChapter(lastStep.id).then((res) => {
            if (res.certificate_id) {
              setCertificateId(res.certificate_id);
              setCertificateUrl(certificateDownloadHref(res.certificate_id));
            }
          }).catch(() => {
            // server chapter completion failed silently
          });
        }
        toast.success(`Mastered! +25 SVG. ${stage.badge} Badge unlocked!`);
      }
    }
  }, [currentStep, stage.steps.length]);

  const selectStep = (stepNum: number) => {
    setCurrentStep(stepNum);
    setExpandedStep(stepNum);
    setShowTrivia(false);
    const nextStep = stage.steps[stepNum - 1];
    if (activeTab === "quiz" && triviaForStep(stage, nextStep, stepNum - 1).length === 0) {
      setActiveTab("read");
    }
  };

  const isMastery = currentStep > stage.steps.length;
  const currentStepObj = currentStep > 0 && !isMastery ? stage.steps[currentStep - 1] : null;
  const currentStepTrivia = triviaForStep(stage, currentStepObj, currentStep - 1);
  const hasQuiz = currentStepTrivia.length > 0;

  function resolveYoutubeId(input: string): string | undefined {
    if (!input) return undefined;
    if (input.includes("embed/")) {
      const m = input.match(/embed\/([^/?]+)/);
      return m ? m[1] : input;
    }
    const m = input.match(/(?:youtu\.be\/|v=)([^&?]+)/);
    return m ? m[1] : input;
  }

  function parseStepVideos(step: ChapterStep | null): ChapterVideo[] {
    if (!step) return [];
    if (step.videos && step.videos.length > 0) return step.videos;
    if (step.youtube_urls && step.youtube_urls.length > 0) {
      return step.youtube_urls.map((url) => ({
        order: 1,
        role: "lecture",
        title: "Video",
        youtube_video_id: resolveYoutubeId(url),
      }));
    }
    if (!step.youtube_url) return [];
    return [{
      order: 1,
      role: "lecture",
      title: "Video",
      youtube_video_id: resolveYoutubeId(step.youtube_url),
    }];
  }

  const stepVideos = parseStepVideos(currentStepObj);

  function videoEmbedUrl(idOrUrl: string): string {
    const id = resolveYoutubeId(idOrUrl);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : idOrUrl;
  }

  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const showNav = stepVideos.length > 1;
  const currentVideoUrl = stepVideos.length > 0 ? videoEmbedUrl(stepVideos[activeVideoIdx]?.youtube_video_id || stepVideos[activeVideoIdx]?.url || "") : null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="px-4 md:px-5 py-2.5 border-b border-border/30 flex items-center justify-between shrink-0 gap-2">
        <div className="min-w-0 flex items-center gap-2">
          <button onClick={onClose} className="p-1 hover:bg-muted/50 rounded-lg transition-colors -ml-1">
            <ChevronLeft className="size-4" />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground font-semibold truncate">{stage.badgeName} / {stage.title}</p>
            <h2 className="text-sm font-black tracking-tight truncate">{stage.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded flex items-center gap-1">
            <BookOpen className="size-3" /> {stage.steps.length} lessons
          </span>
          {stage.documentName && (
            <span className="hidden sm:flex px-2 py-0.5 bg-muted/40 text-muted-foreground text-[10px] font-bold rounded items-center gap-1">
              <BookOpenText className="size-3" /> {stage.documentName}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <div className="flex-1 min-w-0 overflow-y-auto p-3 md:p-4 lg:p-5">
          {isMastery ? (
            <MasteryPage badge={stage.badge} badgeName={stage.badgeName} title={stage.documentName || "Stage Mastered"} hasNext={hasNext} onNextStage={onNextStage} onClose={onClose} certificateUrl={certificateUrl} certificateId={certificateId} />
          ) : (
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                {[
                  { id: "read", label: "Read", icon: BookOpenText },
                  { id: "watch", label: "Watch", icon: Video },
                  ...(hasQuiz ? [{ id: "quiz", label: "Quiz", icon: Brain }] : []),
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.id ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}>
                    <tab.icon className="size-3.5" />
                    {tab.label}
                  </button>
                ))}
                <span className="ml-auto text-[10px] text-muted-foreground font-semibold shrink-0">
                  Step {currentStep} of {stage.steps.length}
                </span>
              </div>

              {/* Mobile step dots — tap to jump between chapters */}
              <div className="md:hidden flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                {stage.steps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isCurrent = currentStep === stepNum;
                  const isPassed = isStepTriviaPassed(step.order);
                  return (
                    <button
                      key={step.id}
                      onClick={() => selectStep(stepNum)}
                      className={`shrink-0 size-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                        isCurrent
                          ? "bg-primary text-primary-foreground shadow-xs scale-110"
                          : isPassed
                            ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                            : "bg-muted/40 text-muted-foreground border border-border/40"
                      }`}
                      title={step.title}
                    >
                      {isPassed ? <CheckCircle2 className="size-3.5" /> : stepNum}
                    </button>
                  );
                })}
              </div>

              <div className="animate-in fade-in duration-200">
                {activeTab === "watch" && (
                  currentVideoUrl ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[10px] font-semibold text-muted-foreground">
                          {stepVideos[activeVideoIdx]?.title || stepVideos[activeVideoIdx]?.role || `Video ${activeVideoIdx + 1}`}
                          {showNav && <span> · {activeVideoIdx + 1} of {stepVideos.length}</span>}
                        </div>
                        {showNav && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setActiveVideoIdx((p) => Math.max(0, p - 1))}
                              disabled={activeVideoIdx === 0}
                              className="size-6 flex items-center justify-center rounded-md bg-muted/40 hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ChevronLeft className="size-3.5" />
                            </button>
                            <button
                              onClick={() => setActiveVideoIdx((p) => Math.min(stepVideos.length - 1, p + 1))}
                              disabled={activeVideoIdx === stepVideos.length - 1}
                              className="size-6 flex items-center justify-center rounded-md bg-muted/40 hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ChevronRight className="size-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xs">
                        <iframe src={currentVideoUrl} title={`${currentStepObj?.title || stage.title} Lesson`} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      </div>
                      {showNav && (
                        <div className="flex items-center justify-center gap-1.5 py-1">
                          {Array.from({ length: stepVideos.length }, (_, i) => (
                            <span
                              key={i}
                              className={`block rounded-full transition-all duration-200 ${
                                i === activeVideoIdx ? "bg-primary w-5 h-1.5" : "bg-muted-foreground/25 w-1.5 h-1.5"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex flex-col items-center justify-center shadow-xs">
                      <div className="size-10 rounded-lg bg-muted/30 flex items-center justify-center">
                        <PlayCircle className="size-5 text-muted-foreground/40" />
                      </div>
                      <p className="text-xs text-muted-foreground/60 font-semibold mt-2">Video coming soon</p>
                    </div>
                  )
                )}

                {activeTab === "read" && currentStep > 0 && (
                  <div className="space-y-3">
                    <div className="space-y-1 pb-3 border-b border-border/30">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black">{currentStepObj?.title || stage.title}</h3>
                        {isBudgetModule && currentStepObj?.budget_entity_name && (
                          <Badge variant="outline" className="text-[10px] font-normal border-primary/30 text-primary">
                            Sector: {currentStepObj.budget_entity_name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{stage.description}</p>
                    </div>

                    {isBudgetModule && budgetLoading && (
                      <div className="space-y-6 py-6">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-xl border border-border/60 bg-card/80 p-4 space-y-3 animate-pulse">
                              <div className="h-3 w-20 bg-muted-foreground/10 rounded" />
                              <div className="h-6 w-24 bg-muted-foreground/10 rounded" />
                              <div className="h-3 w-32 bg-muted-foreground/10 rounded" />
                            </div>
                          ))}
                        </div>
                        <div className="h-[220px] sm:h-[280px] rounded-xl border border-border/60 bg-card/80 animate-pulse flex items-center justify-center">
                          <Loader2 className="size-5 animate-spin text-muted-foreground/40" />
                        </div>
                      </div>
                    )}

                    {isBudgetModule && !budgetLoading && budgetReportProfile && currentStep === 1 && (
                      <BudgetModuleReportOverview report={budgetReportProfile} />
                    )}

                    {isBudgetModule && !budgetLoading && getChapterReport(currentStepObj) && currentStep > 1 && (
                      <BudgetInlineSnapshot report={getChapterReport(currentStepObj)!} />
                    )}

                    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed">
                      <StepContent
                        step={stage.steps[currentStep - 1]}
                        currentStep={currentStep}
                        totalSteps={stage.steps.length}
                        activeFormat="text"
                        showTrivia={showTrivia}
                        origin=""
                        hasTrivia={hasQuiz}
                        getPersonalizedText={(txt) => txt}
                        onFormatChange={() => {}}
                        onStartTrivia={() => { setActiveTab("quiz"); setShowTrivia(true); }}
                      />
                    </div>

                    {isBudgetModule && !budgetLoading && getChapterReport(currentStepObj) && currentStep > 1 && (
                      <BudgetInlineDeepDive report={getChapterReport(currentStepObj)!} />
                    )}
                  </div>
                )}

                {activeTab === "quiz" && currentStep > 0 && (
                  <div className="pt-2">
                    {!showTrivia ? (
                      <div className="space-y-3">
                        <div className="space-y-1 pb-3 border-b border-border/30">
                          <h3 className="text-base font-black">Knowledge Check</h3>
                          <p className="text-xs text-muted-foreground">Test what you learned in this step.</p>
                        </div>
                        <Button onClick={() => setShowTrivia(true)} size="sm" className="rounded-lg text-xs font-bold">
                          Start Knowledge Check
                        </Button>
                      </div>
                    ) : (
                      <TriviaSection
                        trivia={currentStepTrivia}
                        stepId={stage.steps[currentStep - 1].order}
                        showTrivia={showTrivia}
                        isStepTriviaPassed={isStepTriviaPassed}
                        onCorrectAnswer={handleCorrectAnswer}
                        onFinish={handleFinishTrivia}
                      />
                    )}
                  </div>
                )}

                {/* Prev / Next step navigation */}
                {!isMastery && (
                  <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/20 mt-8 pb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectStep(currentStep - 1)}
                      disabled={currentStep <= 1}
                      className="rounded-lg text-xs font-bold gap-1"
                    >
                      <ChevronLeft className="size-3.5" />
                      Previous
                    </Button>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      Step {currentStep} of {stage.steps.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectStep(currentStep + 1)}
                      disabled={currentStep >= stage.steps.length}
                      className="rounded-lg text-xs font-bold gap-1"
                    >
                      Next
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex md:w-[260px] bg-muted/10 border-l border-border/30 flex-col shrink-0">
          <div className="p-3 border-b border-border/30">
            <h3 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Curriculum</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {stage.steps.map((step, idx) => {
              const stepNum = idx + 1;
              const isExpanded = expandedStep === stepNum;
              const isPassed = isStepTriviaPassed(step.order);
              const isCurrent = currentStep === stepNum;

              return (
                <div key={step.id} className="border-b border-border/20">
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : stepNum)}
                    className={`w-full flex items-center justify-between p-2.5 transition-colors hover:bg-muted/30 ${isCurrent ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex items-center gap-2 text-left min-w-0">
                      <div className={`size-4.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isPassed ? "bg-emerald-500 text-white" :
                        isCurrent ? "bg-primary text-white" :
                        "bg-muted/50 text-muted-foreground"
                      }`}>
                        {isPassed ? <CheckCircle2 className="size-3" /> : stepNum}
                      </div>
                      <span className={`text-[11px] font-semibold truncate ${isCurrent ? 'text-primary' : 'text-foreground'}`}>{step.title}</span>
                    </div>
                    <ChevronDown className={`size-3 text-muted-foreground transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-2.5 pt-0.5 space-y-0.5">
                      <button onClick={() => selectStep(stepNum)}
                        className="w-full flex items-center justify-between py-1 px-2 rounded-lg hover:bg-muted/30 transition-colors text-left group">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <PlayCircle className="size-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                          <span className="text-[10px] font-semibold text-foreground/70 group-hover:text-foreground truncate">Reading</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-semibold shrink-0">10 min</span>
                      </button>
                      {triviaForStep(stage, step, idx).length > 0 && (
                        <button onClick={() => { selectStep(stepNum); setActiveTab("quiz"); setShowTrivia(true); }}
                          className="w-full flex items-center justify-between py-1 px-2 rounded-lg hover:bg-muted/30 transition-colors text-left group">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <CheckCircle2 className="size-3 text-muted-foreground group-hover:text-amber-500 transition-colors shrink-0" />
                            <span className="text-[10px] font-semibold text-foreground/70 group-hover:text-foreground truncate">Quiz</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-semibold shrink-0">5 min</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
