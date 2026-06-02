"use client";

import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { cn } from "@/utils";
import { Sparkles } from "lucide-react";
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

export function StepContent({
  step,
  currentStep,
  totalSteps,
  activeFormat,
  showTrivia,
  origin,
  getPersonalizedText,
  onFormatChange,
  onStartTrivia,
}: StepContentProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-muted-foreground">
            Step {currentStep} of {totalSteps} · ~3 min remaining
          </p>
          <h3 className="text-base font-black text-foreground">
            {step.title}
          </h3>
        </div>
      </div>
      <Progress value={((currentStep - 1) / totalSteps) * 100} className="h-1.5 rounded-full" />

      {!showTrivia && (
        <div className="inline-flex items-center gap-0.5 p-0.5 bg-muted/60 rounded-lg">
          <button
            onClick={() => onFormatChange("video")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5",
              activeFormat === "video" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            🎥 Watch
          </button>
          <button
            onClick={() => onFormatChange("text")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5",
              activeFormat === "text" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            📖 Read
          </button>
        </div>
      )}

      {!showTrivia && (
        <>
          {activeFormat === "video" && origin && (
            <div className="max-w-[78%] mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-sm">
                <iframe
                  className="w-full h-full border-0"
                  src={`https://www.youtube-nocookie.com/embed/${step.youtube_url}?rel=0&modestbranding=1`}
                  title="Budget Ndio Story Step Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {activeFormat === "text" && (
            <div className="w-full max-w-none mx-auto px-4 py-6 md:px-8 md:py-8">
              <article 
                className="
                  text-foreground leading-relaxed
                  [&>p]:mb-5 [&>p]:text-gray-800 dark:[&>p]:text-gray-200
                  [&>h1]:text-2xl [&>h1]:font-black [&>h1]:mb-4 [&>h1]:mt-8
                  [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-6
                  [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:mt-4
                  [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-5 [&>ul]:space-y-2
                  [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-5 [&>ol]:space-y-2
                  [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-5
                  [&>strong]:font-bold [&>b]:font-bold
                  [&>a]:text-primary [&>a]:underline hover:[&>a]:text-primary/80
                "
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(getPersonalizedText(step.text)) }}
              />

              {(() => {
                const takeaway: StageTakeaway | undefined = step.takeaways?.[0];
                if (!takeaway) return null;
                const isInfo = takeaway.type === "info" || takeaway.type === "tip";
                return (
                  <div className={cn(
                    "mt-8 p-5 rounded-2xl border-l-4 shadow-sm",
                    isInfo
                      ? "bg-blue-50/80 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400"
                      : "bg-amber-50/80 border-amber-500 dark:bg-amber-900/20 dark:border-amber-400"
                  )}>
                    <p className={cn(
                      "text-sm font-bold flex items-center gap-2",
                      isInfo ? "text-blue-700 dark:text-blue-300" : "text-amber-700 dark:text-amber-300"
                    )}>{isInfo ? "💡" : "⚠️"} {takeaway.title}</p>
                    <p className="text-[13px] text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">{stripHtml(takeaway.text)}</p>
                  </div>
                );
              })()}
            </div>
          )}

          {activeFormat === "text" && step.trivia.length > 0 && (
            <div className="flex justify-center pt-4 not-prose">
              <Button onClick={onStartTrivia} className="h-12 rounded-xl font-bold text-sm gap-2">
                <Sparkles className="size-5" /> {currentStep === totalSteps ? "Check your Understanding" : "Start Knowledge Check"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
