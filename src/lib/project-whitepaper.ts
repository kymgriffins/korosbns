/**
 * Project white-paper generator.
 *
 * Builds substantial dossier markdown for every showcased project so
 * `/bns-project/[id]` never lands on a thin description-only page.
 *
 * Priority for body copy:
 * 1. Authoritative authored `wysiwygProse` / `prose` (kept when already substantial)
 * 2. YouTube / authored transcript → structured white paper sections
 * 3. Production archive fields (briefChallenge, whatWeProduced, outputs, impact)
 *
 * Transcript pages are labeled with provenance — never presented as silent invention.
 */

export type WhitePaperImpact = {
  primaryMetric?: string;
  context?: string;
  verificationOutcome?: string;
};

export type WhitePaperTranscript = {
  videoId?: string;
  title?: string;
  language?: string;
  fullTranscript?: string;
  segments?: Array<{ start?: number; end?: number; text: string }>;
  /** Where the words came from */
  source: "youtube-captions" | "authored" | "unavailable";
};

export type WhitePaperInput = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  prose?: string;
  wysiwygProse?: string;
  briefChallenge?: string;
  whatWeProduced?: string;
  outputs?: string[];
  impactEvidence?: WhitePaperImpact;
  organisationName?: string;
  programmeLabel?: string;
  contentType?: string;
  date?: string;
  videoUrl?: string;
  videoId?: string;
  tags?: string[];
  transcript?: WhitePaperTranscript | null;
};

/** Authored bodies shorter than this are treated as incomplete and get expanded. */
export const MIN_WHITE_PAPER_CHARS = 700;

export function measureWhitePaperLength(markdown: string | undefined | null): number {
  return (markdown || "").replace(/\s+/g, " ").trim().length;
}

export function hasSubstantialWhitePaper(markdown: string | undefined | null): boolean {
  return measureWhitePaperLength(markdown) >= MIN_WHITE_PAPER_CHARS;
}

function transcriptPlainText(transcript?: WhitePaperTranscript | null): string {
  if (!transcript) return "";
  if (transcript.fullTranscript?.trim()) return transcript.fullTranscript.trim();
  if (transcript.segments?.length) {
    return transcript.segments
      .map((s) => s.text.trim())
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

function formatTimestamp(seconds?: number): string {
  if (seconds == null || Number.isNaN(seconds)) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function buildTranscriptSection(transcript: WhitePaperTranscript): string {
  const plain = transcriptPlainText(transcript);
  if (!plain) return "";

  const sourceLabel =
    transcript.source === "youtube-captions"
      ? "YouTube captions (auto-fetched)"
      : transcript.source === "authored"
        ? "Authored production transcript"
        : "Transcript source unavailable";

  const lines: string[] = [
    "## Source film transcript",
    "",
    `> Provenance: ${sourceLabel}${transcript.language ? ` · language \`${transcript.language}\`` : ""}${transcript.videoId ? ` · video \`${transcript.videoId}\`` : ""}.`,
    "",
  ];

  if (transcript.segments && transcript.segments.length >= 4) {
    lines.push("### Timed excerpts");
    lines.push("");
    for (const seg of transcript.segments.slice(0, 24)) {
      const stamp = formatTimestamp(seg.start);
      lines.push(`- ${stamp ? `**${stamp}** — ` : ""}${seg.text.trim()}`);
    }
    if (transcript.segments.length > 24) {
      lines.push("");
      lines.push(
        `_Showing 24 of ${transcript.segments.length} timed segments. Full transcript follows._`,
      );
    }
    lines.push("");
    lines.push("### Full transcript");
    lines.push("");
  }

  lines.push(plain);
  lines.push("");
  return lines.join("\n");
}

function buildDossierFromArchive(input: WhitePaperInput): string {
  const lines: string[] = [];
  lines.push(`# ${input.title}`);
  lines.push("");
  if (input.subtitle) {
    lines.push(`*${input.subtitle}*`);
    lines.push("");
  }

  const metaBits = [
    input.organisationName,
    input.programmeLabel,
    input.contentType,
    input.date,
  ].filter(Boolean);
  if (metaBits.length) {
    lines.push(`**Production dossier** · ${metaBits.join(" · ")}`);
    lines.push("");
  }

  lines.push("## Executive briefing");
  lines.push("");
  lines.push(
    (input.description || input.prose || input.briefChallenge || "").trim() ||
      "This production is part of the Budget Ndio Story evidence portfolio.",
  );
  lines.push("");

  if (input.briefChallenge) {
    lines.push("## The challenge");
    lines.push("");
    lines.push(input.briefChallenge.trim());
    lines.push("");
  }

  if (input.whatWeProduced) {
    lines.push("## What we produced");
    lines.push("");
    lines.push(input.whatWeProduced.trim());
    lines.push("");
  }

  if (input.outputs && input.outputs.length > 0) {
    lines.push("### Deliverables");
    lines.push("");
    for (const item of input.outputs) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }

  if (input.impactEvidence) {
    const { primaryMetric, context, verificationOutcome } = input.impactEvidence;
    if (primaryMetric || context || verificationOutcome) {
      lines.push("## Impact & verification");
      lines.push("");
      if (primaryMetric) lines.push(`- **Primary signal:** ${primaryMetric}`);
      if (context) lines.push(`- **Context:** ${context}`);
      if (verificationOutcome) lines.push(`- **Verification:** ${verificationOutcome}`);
      lines.push("");
    }
  }

  if (input.tags && input.tags.length > 0) {
    lines.push("## Tags");
    lines.push("");
    lines.push(input.tags.map((t) => `\`${t}\``).join(" · "));
    lines.push("");
  }

  if (input.videoUrl || input.videoId) {
    const watch =
      input.videoUrl ||
      (input.videoId ? `https://www.youtube.com/watch?v=${input.videoId}` : "");
    lines.push("## Watch");
    lines.push("");
    lines.push(`[Open the source film](${watch})`);
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Ensure every project has white-paper-grade documentation.
 * Never invent budget numbers — only restructures provided archive fields + transcripts.
 */
export function generateProjectWhitePaper(input: WhitePaperInput): string {
  const authored = (input.wysiwygProse || input.prose || "").trim();
  const authoredIsSubstantial = hasSubstantialWhitePaper(authored);
  const transcriptSection = input.transcript
    ? buildTranscriptSection(input.transcript)
    : "";

  if (authoredIsSubstantial) {
    if (
      transcriptSection &&
      !authored.toLowerCase().includes("source film transcript") &&
      !authored.toLowerCase().includes("full transcript")
    ) {
      return `${authored}\n\n---\n\n${transcriptSection}`.trim();
    }
    return authored;
  }

  const dossier = buildDossierFromArchive(input);
  const provenance = [
    "## Documentation provenance",
    "",
    input.transcript && transcriptPlainText(input.transcript)
      ? "This page was auto-assembled from the production archive **and** the source film transcript."
      : "This page was auto-assembled from the BNS Studios production archive (challenge, deliverables, and verified impact notes). Timed YouTube captions were unavailable at generation time — re-run `pnpm project:transcripts` when captions can be fetched.",
    "",
  ].join("\n");

  return `${dossier}${transcriptSection ? `\n${transcriptSection}` : ""}\n${provenance}`.trim();
}

/** True when a project page body is ready for public reading. */
export function assertProjectPageReady(markdown: string | undefined | null): boolean {
  return hasSubstantialWhitePaper(markdown);
}
