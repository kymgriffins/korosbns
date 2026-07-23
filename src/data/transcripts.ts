import type { TranscriptEntry } from "@/data/videos";
import transcriptsFallback from "@/data/fallbacks/video-transcripts.json";

export type { TranscriptEntry };

const DEFAULT_TRANSCRIPTS: Record<string, TranscriptEntry[]> = {
  ...(transcriptsFallback.transcripts as Record<string, TranscriptEntry[]>),
};

let _transcripts: Record<string, TranscriptEntry[]> = { ...DEFAULT_TRANSCRIPTS };

function readSession(videoId: string): TranscriptEntry[] | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const cached = sessionStorage.getItem(`transcript_${videoId}`);
    if (!cached) return null;
    return JSON.parse(cached) as TranscriptEntry[];
  } catch {
    return null;
  }
}

function writeSession(videoId: string, entries: TranscriptEntry[]): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(`transcript_${videoId}`, JSON.stringify(entries));
  } catch {
    /* storage full */
  }
}

export function getTranscript(videoId: string): TranscriptEntry[] | null {
  const cached = readSession(videoId);
  if (cached) return cached;
  return _transcripts[videoId] ?? DEFAULT_TRANSCRIPTS[videoId] ?? null;
}

export function setTranscript(videoId: string, entries: TranscriptEntry[]): void {
  _transcripts[videoId] = entries;
  writeSession(videoId, entries);
}

/** JSON-only timed cues — no external transcript HTTP from the frontend. */
export async function fetchTranscript(videoId: string): Promise<TranscriptEntry[] | null> {
  const entries = getTranscript(videoId);
  if (entries?.length) {
    setTranscript(videoId, entries);
    return entries;
  }
  return null;
}

export function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
