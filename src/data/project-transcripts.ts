/**
 * Project film transcripts — keyed by YouTube video id and/or project id.
 * JSON-only (headless). Never invents caption text.
 */

import terraTranscript from "@/content/projects/project-terra-transcript.json";

export type ProjectTranscriptRecord = {
  videoId?: string;
  title?: string;
  language?: string;
  fullTranscript?: string;
  segments?: Array<{ start?: number; end?: number; text: string }>;
  source: "youtube-captions" | "authored" | "unavailable";
  projectId?: string;
};

type RawTranscript = {
  videoId?: string;
  projectId?: string;
  title?: string;
  language?: string;
  full_transcript?: string;
  fullTranscript?: string;
  segments?: Array<{ id?: number; start?: number; end?: number; text: string }>;
  source?: ProjectTranscriptRecord["source"];
};

const RAW: RawTranscript[] = [
  {
    ...terraTranscript,
    projectId: "project-terra",
    source: "authored",
  },
];

function normalize(raw: RawTranscript): ProjectTranscriptRecord {
  return {
    videoId: raw.videoId,
    title: raw.title,
    language: raw.language || "en",
    fullTranscript: raw.fullTranscript || raw.full_transcript || "",
    segments: Array.isArray(raw.segments)
      ? raw.segments.map((s) => ({
          start: s.start,
          end: s.end,
          text: s.text,
        }))
      : undefined,
    source: raw.source || "authored",
    projectId: raw.projectId,
  };
}

const BY_VIDEO = new Map<string, ProjectTranscriptRecord>();
const BY_PROJECT = new Map<string, ProjectTranscriptRecord>();

for (const raw of RAW) {
  const entry = normalize(raw);
  if (entry.videoId) BY_VIDEO.set(entry.videoId, entry);
  if (entry.projectId) BY_PROJECT.set(entry.projectId, entry);
}

export function getProjectTranscript(opts: {
  videoId?: string | null;
  projectId?: string | null;
}): ProjectTranscriptRecord | null {
  if (opts.projectId && BY_PROJECT.has(opts.projectId)) {
    return BY_PROJECT.get(opts.projectId) || null;
  }
  if (opts.videoId && BY_VIDEO.has(opts.videoId)) {
    return BY_VIDEO.get(opts.videoId) || null;
  }
  return null;
}

export function listProjectTranscriptVideoIds(): string[] {
  return [...BY_VIDEO.keys()];
}
