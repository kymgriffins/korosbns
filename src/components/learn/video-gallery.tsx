"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Calendar, ChevronDown, ChevronUp, ExternalLink, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { LearnPageShell } from "@/components/learn/learn-page-shell";
import {
  LearnCardGrid,
  LearnEmptyState,
  LearnPageBody,
  LearnSearchField,
  LearnToolbar,
} from "@/components/learn/learn-ui-primitives";
import type { YouTubeVideo } from "@/data/videos";
import { getVideos, embedUrl } from "@/data/videos";
import { getTranscript, fetchTranscript, formatTimestamp } from "@/data/transcripts";
import type { TranscriptEntry } from "@/data/transcripts";
import { cn } from "@/utils";

function VideoCard({
  video,
  defaultExpanded,
}: {
  video: YouTubeVideo;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);
  const [transcript, setTranscript] = useState<TranscriptEntry[] | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [transcriptVisible, setTranscriptVisible] = useState(false);

  useEffect(() => {
    const t = getTranscript(video.videoId);
    if (t) setTranscript(t);
  }, [video.videoId]);

  const handleToggleTranscript = useCallback(async () => {
    if (transcript) {
      setTranscriptVisible((p) => !p);
      return;
    }
    setLoadingTranscript(true);
    try {
      const t = await fetchTranscript(video.videoId);
      if (t) {
        setTranscript(t);
        setTranscriptVisible(true);
      }
    } finally {
      setLoadingTranscript(false);
    }
  }, [video.videoId, transcript]);

  const date = new Date(video.publishedAt).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div variants={fadeInUp} className="group">
      <div
        className={cn(
          "rounded-2xl border border-border/60 bg-card shadow-xs transition-all duration-200 overflow-hidden",
          expanded ? "shadow-md" : "hover:shadow-md hover:border-primary/20",
        )}
      >
        <div
          className="aspect-video relative bg-black overflow-hidden cursor-pointer"
          onClick={() => setExpanded((p) => !p)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setExpanded((p) => !p); }}
          role="button"
          tabIndex={0}
          aria-label={expanded ? "Collapse video" : "Expand video"}
        >
          <iframe
            src={embedUrl(video.videoId)}
            title={video.title}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                {video.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
                <Calendar className="size-3" />
                <span>{date}</span>
              </div>
            </div>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 rounded-lg border border-border/60 p-1.5 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              aria-label="Watch on YouTube"
            >
              <ExternalLink className="size-3.5" />
            </a>
          </div>

          <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
            {video.description}
          </p>

          {transcriptVisible && transcript && transcript.length > 0 && (
            <div className="rounded-xl border border-border/50 bg-muted/30 p-3 max-h-48 overflow-y-auto space-y-1.5 text-[11px] leading-relaxed scrollbar-thin">
              {transcript.map((entry, i) => (
                <div key={i} className="flex gap-2">
                  <span className="shrink-0 text-[10px] font-mono text-muted-foreground mt-0.5">
                    {formatTimestamp(entry.start)}
                  </span>
                  <span className="text-foreground/80">{entry.text}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={handleToggleTranscript}
              disabled={loadingTranscript}
              className="text-[11px] gap-1"
            >
              <FileText className="size-3" />
              {loadingTranscript
                ? "Loading..."
                : transcriptVisible
                  ? "Hide Transcript"
                  : transcript
                    ? "Show Transcript"
                    : "Fetch Transcript"}
            </Button>

            <Button
              variant="ghost"
              size="xs"
              onClick={() => setExpanded((p) => !p)}
              className="text-[11px] gap-1 ml-auto"
            >
              {expanded ? (
                <ChevronUp className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
              {expanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function VideoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function VideoGallery() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  useEffect(() => {
    const data = getVideos();
    setVideos(data);
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    let result = [...videos];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q),
      );
    }
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return result;
  }, [videos, search, sortBy]);

  if (loading) {
    return (
      <LearnPageShell navId="videos">
        <LearnPageBody>
          <VideoGridSkeleton />
        </LearnPageBody>
      </LearnPageShell>
    );
  }

  return (
    <LearnPageShell navId="videos">
      <LearnPageBody>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <LearnToolbar>
            <LearnSearchField
              value={search}
              onChange={setSearch}
              placeholder="Search videos…"
              className="w-full max-w-xs"
            />
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-36 rounded-xl bg-background text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="title">A–Z</SelectItem>
              </SelectContent>
            </Select>
          </LearnToolbar>

          {filtered.length === 0 ? (
            <LearnEmptyState
              icon={FileText}
              title="No videos found"
              description={search ? `Nothing matches "${search}".` : "Videos will appear here when published."}
              action={
                search ? (
                  <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                    Clear search
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <LearnCardGrid columns={3}>
              {filtered.map((video) => (
                <VideoCard key={video.videoId} video={video} />
              ))}
            </LearnCardGrid>
          )}

          <p className="text-center text-[11px] text-muted-foreground">
            {filtered.length} video{filtered.length !== 1 ? "s" : ""}
            {search ? ` matching "${search}"` : ""}
          </p>
        </motion.div>
      </LearnPageBody>
    </LearnPageShell>
  );
}
