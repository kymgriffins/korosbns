#!/usr/bin/env node
/**
 * Fetch YouTube captions for showcased projects via yt-dlp and write
 * JSON transcripts under src/content/projects/transcripts/.
 *
 * Usage: node scripts/fetch-project-transcripts.mjs
 * Requires: yt-dlp on PATH
 *
 * Rate limits are common — the script sleeps between videos and skips failures.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "src/content/projects/transcripts");
const studiosPath = path.join(root, "src/data/fallbacks/studios-evidence.json");
const featuredPath = path.join(root, "src/data/fallbacks/featured-projects.json");

mkdirSync(outDir, { recursive: true });

function extractVideoId(url) {
  if (!url) return null;
  const m = String(url).match(/[?&]v=([^&]+)/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

function collectTargets() {
  const studios = JSON.parse(readFileSync(studiosPath, "utf8"));
  const featured = JSON.parse(readFileSync(featuredPath, "utf8"));
  const map = new Map();

  for (const p of studios.projects || []) {
    const id = extractVideoId(p.media?.videoUrl);
    if (id) map.set(id, { videoId: id, projectId: p.id, title: p.title });
  }
  for (const f of featured.results || []) {
    const id = f.videoId || extractVideoId(f.url);
    if (id) map.set(id, { videoId: id, projectId: f.id, title: f.title });
  }
  return [...map.values()];
}

function parseVtt(vtt) {
  const lines = vtt.split(/\r?\n/);
  const segments = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(
      /(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s-->\s(\d{2}):(\d{2}):(\d{2})\.(\d{3})/,
    );
    if (m) {
      const start =
        Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / 1000;
      const end =
        Number(m[5]) * 3600 + Number(m[6]) * 60 + Number(m[7]) + Number(m[8]) / 1000;
      i += 1;
      const textLines = [];
      while (i < lines.length && lines[i].trim() !== "") {
        textLines.push(lines[i].replace(/<[^>]+>/g, "").trim());
        i += 1;
      }
      const text = textLines.filter(Boolean).join(" ").trim();
      if (text) segments.push({ start, end, text });
    }
    i += 1;
  }
  // Deduplicate consecutive identical auto-caption cues
  const deduped = [];
  for (const seg of segments) {
    const prev = deduped[deduped.length - 1];
    if (prev && prev.text === seg.text) {
      prev.end = seg.end;
      continue;
    }
    deduped.push({ ...seg });
  }
  return deduped;
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

const targets = collectTargets();
console.log(`Found ${targets.length} YouTube targets`);

for (const target of targets) {
  const prefix = path.join(outDir, target.videoId);
  console.log(`\n→ ${target.videoId} (${target.projectId})`);
  try {
    execFileSync(
      "yt-dlp",
      [
        "--no-update",
        "--skip-download",
        "--write-auto-sub",
        "--write-sub",
        "--sub-lang",
        "en,en-US,en-GB",
        "--sub-format",
        "vtt",
        "-o",
        `${prefix}.%(ext)s`,
        `https://www.youtube.com/watch?v=${target.videoId}`,
      ],
      { stdio: "inherit", cwd: root },
    );
  } catch {
    console.warn(`  skip: yt-dlp failed for ${target.videoId}`);
    sleep(4000);
    continue;
  }

  const vttFiles = readdirSync(outDir).filter(
    (f) => f.startsWith(target.videoId) && f.endsWith(".vtt"),
  );
  if (!vttFiles.length) {
    console.warn("  no VTT written");
    sleep(4000);
    continue;
  }

  const vttPath = path.join(outDir, vttFiles[0]);
  const segments = parseVtt(readFileSync(vttPath, "utf8"));
  const payload = {
    videoId: target.videoId,
    projectId: target.projectId,
    title: target.title,
    language: "en",
    source: "youtube-captions",
    full_transcript: segments.map((s) => s.text).join(" "),
    segments: segments.map((s, idx) => ({
      id: idx,
      start: s.start,
      end: s.end,
      text: s.text,
    })),
  };
  const jsonPath = path.join(outDir, `${target.videoId}.json`);
  writeFileSync(jsonPath, JSON.stringify(payload, null, 2), "utf8");
  console.log(`  wrote ${jsonPath} (${segments.length} segments)`);
  sleep(5000);
}

console.log("\nDone. Import new JSON files into src/data/project-transcripts.ts when ready.");
