"use client";

import { Progress } from "@/ui/progress";
import { cn } from "@/utils";
import { getStageTakeaway } from "@/constants/stages-data";

interface StepContentProps {
  step: {
    id: number;
    title: string;
    youtubeId: string;
    text: string;
  };
  stageId: number;
  currentStep: number;
  totalSteps: number;
  activeFormat: "video" | "text";
  showTrivia: boolean;
  origin: string;
  getPersonalizedText: (text: string) => string;
  onFormatChange: (format: "video" | "text") => void;
}

export function StepContent({
  step,
  stageId,
  currentStep,
  totalSteps,
  activeFormat,
  showTrivia,
  origin,
  getPersonalizedText,
  onFormatChange,
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
                  src={`https://www.youtube-nocookie.com/embed/${step.youtubeId}?rel=0&modestbranding=1`}
                  title="Budget Ndio Story Step Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {activeFormat === "text" && (
            <article className="
              w-full max-w-none mx-auto px-4 py-6 md:px-8 md:py-8
              prose prose-base prose-neutral dark:prose-invert max-w-none
              prose-p:text-gray-800 prose-p:dark:text-gray-300
              prose-p:leading-7 md:prose-p:leading-relaxed prose-p:my-3 md:prose-p:my-4
              prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-semibold
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-ul:my-3 md:prose-ul:my-4 prose-li:my-1
            ">
              {getPersonalizedText(step.text)
                .split("\n\n")
                .map((para, pIdx) => (
                  <p key={pIdx} className="whitespace-pre-wrap">{para}</p>
                ))}

              {(() => {
                const takeaway = getStageTakeaway(stageId, step.id);
                if (!takeaway) return null;
                if (takeaway.type === "info") {
                  return (
                    <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400 not-prose">
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-300">💡 {takeaway.title}</p>
                      <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-1 leading-normal">{takeaway.text}</p>
                    </div>
                  );
                }
                return (
                  <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 dark:bg-amber-900/20 dark:border-amber-400 not-prose">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-300">⚠️ {takeaway.title}</p>
                    <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-1 leading-normal">{takeaway.text}</p>
                  </div>
                );
              })()}
            </article>
          )}
        </>
      )}
    </div>
  );
}
