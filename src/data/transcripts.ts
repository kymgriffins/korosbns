import type { TranscriptEntry, YouTubeVideo } from "@/data/videos";

export type { TranscriptEntry };

const TRANSCRIPT_API_BASE = "https://youtubetranscript.com/api";

const DEFAULT_TRANSCRIPTS: Record<string, TranscriptEntry[]> = {
  "FkgRz4v2Llk": [
    { text: "Welcome to Part 3 of our Budget Policy Statement series.", start: 0, duration: 4.5 },
    { text: "Today we are looking at what happens after the BPS is tabled in Parliament.", start: 4.5, duration: 6.2 },
    { text: "This is where the real conversation begins on how public money will be spent.", start: 10.7, duration: 5.8 },
    { text: "The BPS sets the ceiling for each sector of government spending.", start: 16.5, duration: 5.1 },
    { text: "These ceilings determine how much goes to health, education, and infrastructure.", start: 21.6, duration: 6.3 },
    { text: "Young people must pay attention because these choices affect jobs and opportunities.", start: 27.9, duration: 5.7 },
    { text: "Parliament now debates and can amend these proposals before the budget is finalized.", start: 33.6, duration: 6.0 },
    { text: "This is your chance to engage with the process and hold leaders accountable.", start: 39.6, duration: 5.4 },
  ],
  "wkPe3sWomoA": [
    { text: "In Part 2 we continue our exploration of the Budget Policy Statement.", start: 0, duration: 4.8 },
    { text: "The BPS is more than just a document, it is a statement of government priorities.", start: 4.8, duration: 5.5 },
    { text: "It tells us what the government plans to focus on in the coming year.", start: 10.3, duration: 4.9 },
    { text: "Revenue projections, expenditure plans, and economic assumptions are all laid out.", start: 15.2, duration: 6.1 },
    { text: "Understanding these numbers helps us know if the government is on track.", start: 21.3, duration: 5.2 },
    { text: "We break down the key sections so you can follow along with the actual document.", start: 26.5, duration: 6.8 },
  ],
  "Ed9lP0-komE": [
    { text: "Before Budget Day, there is a critical document you need to know about.", start: 0, duration: 4.2 },
    { text: "The Budget Policy Statement or BPS is where the government sets its fiscal strategy.", start: 4.2, duration: 5.8 },
    { text: "It is presented to Parliament in February each year before the main budget.", start: 10.0, duration: 5.3 },
    { text: "This is where priorities are established and spending ceilings are set.", start: 15.3, duration: 5.1 },
    { text: "If you care about education, health, or jobs, this is where the conversation starts.", start: 20.4, duration: 6.0 },
    { text: "In this series we explain what the BPS means for ordinary Kenyans.", start: 26.4, duration: 5.6 },
    { text: "Budget Ndio Story is here to make sure you understand where your money goes.", start: 32.0, duration: 5.8 },
  ],
  "SfPwtqUFyj4": [
    { text: "Kenya's National Infrastructure Fund is now law and this has big implications.", start: 0, duration: 4.5 },
    { text: "In Part 4 we examine how this fund will be financed and managed.", start: 4.5, duration: 5.2 },
    { text: "The fund is designed to finance major infrastructure projects across the country.", start: 9.7, duration: 5.8 },
    { text: "Key questions remain about transparency and how the money will be tracked.", start: 15.5, duration: 5.3 },
    { text: "We raise the accountability questions that must stay at the centre of public debate.", start: 20.8, duration: 6.1 },
  ],
  "KeNCrx6krl0": [
    { text: "Part 3 of our deep dive into the National Infrastructure Fund.", start: 0, duration: 4.0 },
    { text: "We continue unpacking what this fund means for Kenya's development.", start: 4.0, duration: 5.5 },
    { text: "The fund aims to mobilize resources for roads, energy, and digital infrastructure.", start: 9.5, duration: 6.2 },
    { text: "But young people must understand how these decisions impact their future.", start: 15.7, duration: 5.1 },
    { text: "Public policy should not be left to experts alone, everyone must engage.", start: 20.8, duration: 5.8 },
  ],
  "jLZe3iPSMfc": [
    { text: "In Part 2 we continue exploring the National Infrastructure Fund.", start: 0, duration: 4.3 },
    { text: "This fund represents a new approach to financing Kenya's infrastructure gap.", start: 4.3, duration: 5.7 },
    { text: "We explain how the fund will work and who will oversee it.", start: 10.0, duration: 5.0 },
    { text: "Accountability mechanisms are crucial for ensuring the money is well spent.", start: 15.0, duration: 5.6 },
    { text: "Join us as we break down the key provisions in simple terms.", start: 20.6, duration: 5.2 },
  ],
  "A_EXLueEMlk": [
    { text: "Kenya's National Infrastructure Fund is now law.", start: 0, duration: 3.8 },
    { text: "But do young people really understand what this means for them?", start: 3.8, duration: 5.2 },
    { text: "In this episode of Budget Ndio Story we unpack the fund in simple terms.", start: 9.0, duration: 5.5 },
    { text: "We explain the key issues and why this matters for every Kenyan.", start: 14.5, duration: 5.0 },
    { text: "Public participation is essential for ensuring this fund benefits everyone.", start: 19.5, duration: 5.8 },
    { text: "Budget Ndio Story is your guide to understanding how public money works.", start: 25.3, duration: 5.6 },
  ],
};

let _transcripts: Record<string, TranscriptEntry[]> = { ...DEFAULT_TRANSCRIPTS };

export function getTranscript(videoId: string): TranscriptEntry[] | null {
  const cached = sessionStorage.getItem(`transcript_${videoId}`);
  if (cached) {
    try {
      return JSON.parse(cached) as TranscriptEntry[];
    } catch {
      /* ignore */
    }
  }
  return _transcripts[videoId] ?? null;
}

export function setTranscript(videoId: string, entries: TranscriptEntry[]): void {
  _transcripts[videoId] = entries;
  try {
    sessionStorage.setItem(`transcript_${videoId}`, JSON.stringify(entries));
  } catch {
    /* storage full */
  }
}

export async function fetchTranscript(videoId: string): Promise<TranscriptEntry[] | null> {
  const cached = getTranscript(videoId);
  if (cached) return cached;

  try {
    const res = await fetch(`${TRANSCRIPT_API_BASE}/?video_id=${videoId}&format=json`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const entries: TranscriptEntry[] = Array.isArray(data)
      ? data.map((item: { text: string; start: number; duration: number }) => ({
          text: item.text,
          start: item.start,
          duration: item.duration,
        }))
      : [];
    if (entries.length > 0) {
      setTranscript(videoId, entries);
      return entries;
    }
  } catch {
    /* fall through to default */
  }

  const fallback = _transcripts[videoId];
  if (fallback) {
    setTranscript(videoId, fallback);
    return fallback;
  }

  return null;
}

export function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
