"use client";

import { useState } from "react";
import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { cn } from "@/utils";
import { Sparkles, Lightbulb, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import type { ChapterStep, StageTakeaway, ChapterVideo } from "@/types/learn";
import { stripHtml } from "@/lib/sanitize";
import { renderContent } from "@/lib/render-content";

interface StepContentProps {
  step: ChapterStep;
  currentStep: number;
  totalSteps: number;
  activeFormat: "video" | "text";
  showTrivia: boolean;
  origin: string;
  getPersonalizedText: (text: string) => string;
  onFormatChange: (format: "video" | "text") => void;
  onStartTrivia: () => void;
}

function resolveYoutubeId(input: string): string {
  if (!input) return "";
  if (input.includes("embed/")) {
    const m = input.match(/embed\/([^/?]+)/);
    return m ? m[1] : input;
  }
  const m = input.match(/(?:youtu\.be\/|v=)([^&?]+)/);
  return m ? m[1] : input;
}

function videoEmbedUrl(idOrUrl: string): string {
  const id = resolveYoutubeId(idOrUrl);
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}

function VideoPlayer({ videos, youtubeUrl, title }: { videos?: ChapterVideo[]; youtubeUrl: string; title: string }) {
  const resolved = videos?.length
    ? videos
    : youtubeUrl
      ? [{ order: 1, role: "lecture", youtube_video_id: resolveYoutubeId(youtubeUrl) }]
      : [];
  const [idx, setIdx] = useState(0);

  if (!resolved.length) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex flex-col items-center justify-center shadow-xs">
        <div className="size-10 rounded-lg bg-muted/30 flex items-center justify-center">
          <Sparkles className="size-5 text-muted-foreground/40" />
        </div>
        <p className="text-xs text-muted-foreground/60 font-semibold mt-2">Video coming soon</p>
      </div>
    );
  }

  const current = resolved[idx];
  const src = videoEmbedUrl(current?.youtube_video_id || current?.url || "");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] font-semibold text-muted-foreground">
          {current?.title || current?.role || `Video ${idx + 1}`}
          {resolved.length > 1 && <span> · {idx + 1} of {resolved.length}</span>}
        </div>
        {resolved.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIdx((p) => Math.max(0, p - 1))}
              disabled={idx === 0}
              className="size-6 flex items-center justify-center rounded-md bg-muted/40 hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              onClick={() => setIdx((p) => Math.min(resolved.length - 1, p + 1))}
              disabled={idx === resolved.length - 1}
              className="size-6 flex items-center justify-center rounded-md bg-muted/40 hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        )}
      </div>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-xs">
        <iframe className="w-full h-full border-0" src={src} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      </div>
    </div>
  );
}

export function StepContent({ step, currentStep, totalSteps, activeFormat, showTrivia, origin, getPersonalizedText, onFormatChange, onStartTrivia }: StepContentProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold text-muted-foreground">Step {currentStep} of {totalSteps} · ~3 min</p>
          <h3 className="text-sm font-black">{step.title}</h3>
        </div>
      </div>
      <Progress value={((currentStep - 1) / totalSteps) * 100} className="h-1 rounded-full" />

      {!showTrivia && (
        <>
          {activeFormat === "video" && origin && (
            <div className="max-w-[78%] mx-auto">
              <VideoPlayer
                videos={step.videos}
                youtubeUrl={step.youtube_url}
                title={`${step.title} Lesson`}
              />
            </div>
          )}

          {activeFormat === "text" && (
            <div className="w-full max-w-none mx-auto px-4 py-4 md:px-6 md:py-6">
              <article className="
                text-foreground leading-relaxed text-[13px]
                [&>p]:mb-4 [&>p]:text-gray-800 dark:[&>p]:text-gray-200
                [&>h1]:text-xl [&>h1]:font-black [&>h1]:mb-3 [&>h1]:mt-6
                [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-2 [&>h2]:mt-5
                [&>h3]:text-base [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:mt-4
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ul]:space-y-1.5
                [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>ol]:space-y-1.5
                [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4
                [&>a]:text-primary [&>a]:underline hover:[&>a]:text-primary/80
              ">
                {renderContent(getPersonalizedText(step.text))}
              </article>

              {(() => {
                const takeaway: StageTakeaway | undefined = step.takeaways?.[0];
                if (!takeaway) return null;
                const isInfo = takeaway.type === "info" || takeaway.type === "tip";
                return (
                  <div className={cn("mt-6 p-4 rounded-xl border-l-4 shadow-xs",
                    isInfo ? "bg-blue-50/50 border-blue-500 dark:bg-blue-900/15 dark:border-blue-400" : "bg-amber-50/50 border-amber-500 dark:bg-amber-900/15 dark:border-amber-400"
                  )}>
                    <p className={cn("text-xs font-bold flex items-center gap-1.5", isInfo ? "text-blue-700 dark:text-blue-300" : "text-amber-700 dark:text-amber-300")}>
                      {isInfo ? <Lightbulb className="size-3.5" /> : <AlertTriangle className="size-3.5" />} {takeaway.title}
                    </p>
                    <p className="text-[12px] text-gray-700 dark:text-gray-300 mt-1.5 leading-relaxed">{stripHtml(takeaway.text)}</p>
                  </div>
                );
              })()}
            </div>
          )}

          {activeFormat === "text" && (step.trivia?.length ?? 0) > 0 && (
            <div className="flex justify-center pt-2">
              <Button onClick={onStartTrivia} size="sm" className="rounded-lg font-bold text-xs gap-1.5">
                <Sparkles className="size-3.5" /> {currentStep === totalSteps ? "Check Understanding" : "Knowledge Check"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
