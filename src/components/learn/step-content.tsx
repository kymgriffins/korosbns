"use client";

import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { cn } from "@/utils";
import { Sparkles, Lightbulb, AlertTriangle } from "lucide-react";
import type { ChapterStep, StageTakeaway } from "@/types/learn";
import { stripHtml, sanitizeHtml } from "@/lib/sanitize";

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
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-xs">
                <iframe className="w-full h-full border-0" src={`https://www.youtube-nocookie.com/embed/${step.youtube_url}?rel=0&modestbranding=1`} title="Lesson Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              </div>
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
              " dangerouslySetInnerHTML={{ __html: sanitizeHtml(getPersonalizedText(step.text)) }} />

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

          {activeFormat === "text" && step.trivia.length > 0 && (
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
