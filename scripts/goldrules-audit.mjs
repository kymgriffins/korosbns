#!/usr/bin/env node
/**
 * Mechanical GOLDRULES audit — counts violations for ratchet in TASKPLAN.
 * Usage: node scripts/goldrules-audit.mjs [--json]
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SRC = join(ROOT, "src");

const SKIP_DIRS = new Set(["node_modules", ".next", "__tests__"]);
const P0_HINTS = [
  "task",
  "learn",
  "auth",
  "weekly-notes",
  "reports",
];

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) await walk(p, files);
    } else if (/\.(tsx|ts|jsx|js)$/.test(e.name)) {
      files.push(p);
    }
  }
  return files;
}

function isP0Path(rel) {
  const lower = rel.toLowerCase();
  return P0_HINTS.some((h) => lower.includes(h));
}

async function main() {
  const files = await walk(SRC);
  const metrics = {
    inlineStyle: [],
    arbitraryTailwind: [],
    rawPalette: [],
    hardcodedDuration: [],
    useFormFiles: new Set(),
    totalFiles: files.length,
  };

  const formPattern = /useForm\s*\(/;
  const inlineStylePattern = /style=\{\{/;
  const arbitraryPattern = /className="[^"]*\[[^\]]+\]/;
  const arbitraryPattern2 = /className=\{[^}]*\[[^\]]+\]/;
  const rawPalettePattern = /\b(bg|text|border)-(blue|red|gray|slate|zinc|neutral|stone|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-/;
  const durationPattern = /duration:\s*0?\.\d+|duration:\s*\d+/;

  for (const file of files) {
    const rel = relative(ROOT, file).replace(/\\/g, "/");
    const content = await readFile(file, "utf8");
    const inMotion = rel.startsWith("src/motion/");

    if (inlineStylePattern.test(content)) metrics.inlineStyle.push(rel);
    if (arbitraryPattern.test(content) || arbitraryPattern2.test(content)) {
      metrics.arbitraryTailwind.push(rel);
    }
    if (rawPalettePattern.test(content)) metrics.rawPalette.push(rel);
    if (!inMotion && durationPattern.test(content) && /framer|motion|animate|transition/.test(content)) {
      metrics.hardcodedDuration.push(rel);
    }
    if (formPattern.test(content)) metrics.useFormFiles.add(rel);
  }

  const report = {
    version: "0.2.0",
    scannedAt: new Date().toISOString(),
    counts: {
      inlineStyle: metrics.inlineStyle.length,
      arbitraryTailwind: metrics.arbitraryTailwind.length,
      rawPalette: metrics.rawPalette.length,
      hardcodedDuration: metrics.hardcodedDuration.length,
      useFormFiles: metrics.useFormFiles.size,
      totalFiles: metrics.totalFiles,
    },
    p0: {
      inlineStyle: metrics.inlineStyle.filter(isP0Path).length,
      arbitraryTailwind: metrics.arbitraryTailwind.filter(isP0Path).length,
    },
    samples: {
      inlineStyle: metrics.inlineStyle.slice(0, 8),
      hardcodedDuration: metrics.hardcodedDuration.slice(0, 8),
    },
  };

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log("GOLDRULES mechanical audit — korosbns\n");
  console.log(`Files scanned: ${report.counts.totalFiles}\n`);
  console.log("| Metric | Count | P0 subset |");
  console.log("|--------|------:|----------:|");
  console.log(`| Inline style={{}} | ${report.counts.inlineStyle} | ${report.p0.inlineStyle} |`);
  console.log(`| Arbitrary Tailwind […] | ${report.counts.arbitraryTailwind} | ${report.p0.arbitraryTailwind} |`);
  console.log(`| Raw palette classes | ${report.counts.rawPalette} | — |`);
  console.log(`| Hardcoded motion duration | ${report.counts.hardcodedDuration} | — |`);
  console.log(`| Files using useForm | ${report.counts.useFormFiles} | — |`);
  console.log("\nRatchet targets: docs/zero-gap/TASKPLAN.md");
  if (report.samples.inlineStyle.length) {
    console.log("\nSample inline style files:", report.samples.inlineStyle.join(", "));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
