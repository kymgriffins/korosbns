"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
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
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import {
  embedUrl,
  getGroupedSeries,
  learnHubItemToVideo,
  videoData,
  type YouTubeVideo,
} from "@/data/videos";
import { getTranscript, fetchTranscript, formatTimestamp } from "@/data/transcripts";
import type { TranscriptEntry } from "@/data/transcripts";
import type { YouTubeSeries } from "@/lib/youtube-series";
import { BPS_MODULE_SLUG } from "@/lib/youtube-series";
import { Routes } from "@/constants/routes";
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

  const date = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

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
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setExpanded((p) => !p);
          }}
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
              {date ? (
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
                  <Calendar className="size-3" />
                  <span>{date}</span>
                </div>
              ) : null}
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

          {transcriptVisible && transcript && transcript.length > 0 ? (
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
          ) : null}

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

function seriesToVideos(series: YouTubeSeries): YouTubeVideo[] {
  return series.videos.map((v) => ({
    videoId: v.videoId,
    title: v.title,
    url: v.url,
    publishedAt: v.publishedAt,
    description: v.description || "",
    channelId: "",
  }));
}

export function VideoGallery() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [seriesFilter, setSeriesFilter] = useState<string>("current");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const items = await videoData.fetch();
        if (cancelled) return;
        const mapped = items
          .map(learnHubItemToVideo)
          .filter((v): v is YouTubeVideo => v != null);
        setVideos(mapped);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const seriesList = useMemo(() => getGroupedSeries(videos), [videos]);

  const filtered = useMemo(() => {
    let pool = videos;
    if (seriesFilter === "current") {
      const current = seriesList.find((s) => s.isCurrent);
      pool = current ? seriesToVideos(current) : videos;
    } else if (seriesFilter !== "all") {
      const match = seriesList.find((s) => s.id === seriesFilter);
      pool = match ? seriesToVideos(match) : videos;
    }

    let result = [...pool];
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
        result.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
        );
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return result;
  }, [videos, search, sortBy, seriesFilter, seriesList]);

  const currentSeries = seriesList.find((s) => s.isCurrent) ?? null;
  const currentHref = currentSeries?.isBps
    ? `/learn/modules/${BPS_MODULE_SLUG}`
    : currentSeries?.videos[0]?.url || Routes.LearnVideos;

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Video Library"
          title="All YouTube Videos"
          description="Every Budget Ndio Story video in one place"
        />
        <VideoGridSkeleton />
      </div>
    );
  }

  return (
    <SectionShell>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="space-y-8"
      >
        <SectionHeader
          eyebrow="Video Library"
          title={
            <>
              All <span className="font-heading italic text-primary">YouTube</span>{" "}
              Videos
            </>
          }
          description="RSS series grouped by title, newest first — current series always advertised."
        />

        {currentSeries ? (
          <div
            data-testid="current-youtube-series"
            className="flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="gap-1 text-[10px]">
                  <Sparkles className="size-3" />
                  Current series
                </Badge>
                {currentSeries.isBps ? (
                  <Badge variant="secondary" className="text-[10px]">
                    With Budget Policy Statement
                  </Badge>
                ) : null}
              </div>
              <p className="text-sm font-semibold leading-snug">{currentSeries.title}</p>
              <p className="text-[11px] text-muted-foreground">
                {currentSeries.videos.length} part
                {currentSeries.videos.length !== 1 ? "s" : ""}
                {currentSeries.latestPublishedAt
                  ? ` · latest ${new Date(currentSeries.latestPublishedAt).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}`
                  : ""}
              </p>
            </div>
            <Button asChild size="sm" className="h-9 shrink-0 rounded-lg text-xs font-bold">
              {currentSeries.isBps || currentHref.startsWith("/") ? (
                <Link href={currentHref}>
                  {currentSeries.isBps ? "Open BPS module" : "Watch current"}
                </Link>
              ) : (
                <a href={currentHref} target="_blank" rel="noopener noreferrer">
                  Watch on YouTube
                </a>
              )}
            </Button>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              className="w-full pl-8 rounded-lg bg-background text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSearch("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={seriesFilter} onValueChange={setSeriesFilter}>
              <SelectTrigger className="w-48 rounded-lg bg-background text-xs">
                <SelectValue placeholder="Series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current series</SelectItem>
                <SelectItem value="all">All series</SelectItem>
                {seriesList.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                    {s.isCurrent ? " · now" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as typeof sortBy)}
            >
              <SelectTrigger className="w-36 rounded-lg bg-background text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <FileText className="size-10 opacity-40" />
            <p className="text-sm">No videos found</p>
            {search ? (
              <Button variant="outline" size="xs" onClick={() => setSearch("")}>
                Clear search
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((video) => (
              <VideoCard key={video.videoId} video={video} />
            ))}
          </div>
        )}

        <div className="text-center text-[11px] text-muted-foreground">
          {filtered.length} video{filtered.length !== 1 ? "s" : ""}
          {search ? ` matching "${search}"` : ""}
          {seriesFilter === "current" && currentSeries
            ? ` in current series · ${currentSeries.title}`
            : ""}
        </div>
      </motion.div>
    </SectionShell>
  );
}
