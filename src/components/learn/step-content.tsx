"use client";

import { useState } from "react";
import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { cn } from "@/utils";
import { Sparkles, Lightbulb, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import type { ChapterStep, StageTakeaway, ChapterVideo } from "@/types/learn";
import { stripHtml } from "@/lib/sanitize";
import { renderContent } from "@/lib/render-content";
import { HarmonizedImage } from "@/components/ui/harmonized-image";
import { resolveYoutubeId, videoEmbedUrl } from "@/lib/learn-video";
import { YouTubePlayer } from "./youtube-player";

interface StepContentProps {
  step: ChapterStep;
  currentStep: number;
  totalSteps: number;
  activeFormat: "video" | "text";
  showTrivia: boolean;
  origin: string;
  hasTrivia?: boolean;
  getPersonalizedText: (text: string) => string;
  onFormatChange: (format: "video" | "text") => void;
  onStartTrivia: () => void;
}

function parseVideoEntries(videos?: ChapterVideo[], youtubeUrl?: string, youtubeUrls?: string[]): ChapterVideo[] {
  if (videos?.length) return videos;
  if (youtubeUrls?.length) {
    return youtubeUrls.map((url) => ({
      order: 1,
      role: "lecture",
      title: "Video",
      youtube_video_id: resolveYoutubeId(url),
    }));
  }
  if (!youtubeUrl) return [];
  return [{
    order: 1,
    role: "lecture",
    title: "Video",
    youtube_video_id: resolveYoutubeId(youtubeUrl),
  }];
}

function VideoDots({ count, active }: { count: number; active: number }) {
  if (count <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      {Array.from({ length }, (_, i) => (
        <span
          key={i}
          className={`block rounded-full transition-all duration-200 ${
            i === active ? "bg-primary w-5 h-1.5" : "bg-muted-foreground/25 w-1.5 h-1.5"
          }`}
        />
      ))}
    </div>
  );
}

function VideoPlayer({ videos, youtubeUrl, youtubeUrls, title }: { videos?: ChapterVideo[]; youtubeUrl: string; youtubeUrls?: string[]; title: string }) {
  const resolved = parseVideoEntries(videos, youtubeUrl, youtubeUrls);
  const [idx, setIdx] = useState(0);
  const showNav = resolved.length > 1;

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
          {showNav && <span> · {idx + 1} of {resolved.length}</span>}
        </div>
        {showNav && (
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
      <YouTubePlayer
        videoId={current?.youtube_video_id || current?.url || ""}
        title={title}
      />
      <VideoDots count={resolved.length} active={idx} />
    </div>
  );
}

export function StepContent({ step, currentStep, totalSteps, activeFormat, showTrivia, origin, hasTrivia, getPersonalizedText, onFormatChange, onStartTrivia }: StepContentProps) {
  const showTriviaCta = hasTrivia ?? (step.trivia?.length ?? 0) > 0;
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold text-muted-foreground">Step {currentStep} of {totalSteps} · ~{step.estimated_minutes ?? 3} min</p>
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
                youtubeUrls={step.youtube_urls}
                title={`${step.title} Lesson`}
              />
            </div>
          )}

          {activeFormat === "text" && (
            <div className="w-full max-w-none mx-auto px-4 py-4 md:px-6 md:py-6">
              {step.image_urls && step.image_urls.length > 0 && (
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {step.image_urls.map((url, i) => (
                    <HarmonizedImage
                      key={i}
                      src={url}
                      alt={`${step.title} image ${i + 1}`}
                      aspectClassName="aspect-[4/3]"
                      className="rounded-xl shadow-xs"
                      imageClassName="object-contain bg-muted/40"
                      fallbackLabel="Lesson image"
                    />
                  ))}
                </div>
              )}

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

          {activeFormat === "text" && showTriviaCta && (
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
