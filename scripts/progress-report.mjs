#!/usr/bin/env node
/**
 * Smart Review — Headless Migration Progress Report
 *
 * Parses TASKLIST.md Phase 7 items and generates a progress report.
 * Run: node scripts/progress-report.mjs
 *
 * Output: progress-report.json (machine-readable) + stdout summary
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TASKLIST_PATH = join(ROOT, "..", "TASKLIST.md");
const OUTPUT_PATH = join(ROOT, "progress-report.json");
const STATE_PATH = join(
  ROOT,
  "..",
  "bnske.budgetndiostory.org",
  "progress_state.json",
);

function readTasklist() {
  if (!existsSync(TASKLIST_PATH)) {
    console.error("[progress-report] TASKLIST.md not found at", TASKLIST_PATH);
    return [];
  }
  return readFileSync(TASKLIST_PATH, "utf-8").split("\n");
}

function readProgressState() {
  if (!existsSync(STATE_PATH)) return null;
  try {
    return JSON.parse(readFileSync(STATE_PATH, "utf-8"));
  } catch {
    return null;
  }
}

function parsePhase(lines, phaseName) {
  const items = [];
  let inPhase = false;
  let step = "";
  let stepCategory = "";

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith(`## ${phaseName}`)) {
      inPhase = true;
      continue;
    }
    if (inPhase && trimmed.startsWith("## ")) break;
    if (!inPhase) continue;

    // Match step headers: ### Step N: Title
    const stepMatch = trimmed.match(/^### (Step \d+[^:]*):(.+)/);
    if (stepMatch) {
      step = `${stepMatch[1].trim()}:${stepMatch[2].trim()}`;
      stepCategory = stepMatch[1].trim().toLowerCase().replace(/\s+/g, "-");
      continue;
    }

    // Match status items: - [ ] or - [x] or - [!]
    const itemMatch = trimmed.match(/^-\s+\[( |~|x|!)\]\s+(.+)/);
    if (itemMatch) {
      const status = itemMatch[1];
      const label = itemMatch[2];
      items.push({
        id: label.split("—")[0].trim().replace(/\s+/g, "-").toLowerCase().slice(0, 60),
        label,
        step,
        stepCategory,
        status:
          status === "x"
            ? "completed"
            : status === "~"
              ? "in_progress"
              : status === "!"
                ? "blocked"
                : "pending",
        phase: phaseName,
      });
    }
  }
  return items;
}

function generateReport() {
  const lines = readTasklist();
  const phaseState = readProgressState();

  const phaseName = "Phase 7: Headless Data Layer Migration";
  const items = parsePhase(lines, phaseName);

  const total = items.length;
  const completed = items.filter((i) => i.status === "completed").length;
  const inProgress = items.filter((i) => i.status === "in_progress").length;
  const blocked = items.filter((i) => i.status === "blocked").length;
  const pending = items.filter((i) => i.status === "pending").length;

  // Compute by step category
  const byStep = {};
  for (const item of items) {
    if (!byStep[item.stepCategory]) {
      byStep[item.stepCategory] = {
        label: item.step,
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        blocked: 0,
      };
    }
    byStep[item.stepCategory].total++;
    byStep[item.stepCategory][
      item.status === "completed"
        ? "completed"
        : item.status === "in_progress"
          ? "inProgress"
          : item.status === "blocked"
            ? "blocked"
            : "pending"
    ]++;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    phase: phaseName,
    summary: { total, completed, inProgress, blocked, pending },
    completionPercent:
      total > 0 ? Math.round((completed / total) * 100) : 0,
    byStep: Object.values(byStep),
    items,
    linkedToBackend: !!phaseState,
    backendState: phaseState
      ? {
          phase: phaseState.phase,
          checklists: phaseState.checklists,
        }
      : null,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));
  return report;
}

function display(report) {
  const { summary, completionPercent, byStep, linkedToBackend } = report;

  console.log("\n========================================");
  console.log("  SMART REVIEW — HEADLESS MIGRATION");
  console.log("========================================\n");
  console.log(`  Phase:    ${report.phase}`);
  console.log(`  Generated: ${report.generatedAt}\n`);
  console.log(
    `  Progress:  ${summary.completed}/${summary.total} items (${completionPercent}%)`,
  );
  console.log(
    `  ${"▓".repeat(Math.floor(completionPercent / 5))}${"░".repeat(20 - Math.floor(completionPercent / 5))}`,
  );
  console.log(`\n  ✅ Completed: ${summary.completed}`);
  console.log(`  🔄 In Progress: ${summary.inProgress}`);
  console.log(`  ⏳ Pending:    ${summary.pending}`);
  console.log(`  🚫 Blocked:    ${summary.blocked}`);
  console.log(`  🔗 Backend-linked: ${linkedToBackend}`);

  console.log("\n  ── By Step ──\n");
  for (const step of byStep) {
    const pct =
      step.total > 0
        ? Math.round((step.completed / step.total) * 100)
        : 0;
    console.log(
      `  ${step.label}`,
    );
    console.log(
      `     ${step.completed}/${step.total} (${pct}%)  ${"▓".repeat(Math.floor(pct / 10))}${"░".repeat(10 - Math.floor(pct / 10))}`,
    );
  }

  console.log("\n  ── Deploy Readiness ──\n");
  const deployReady =
    summary.blocked === 0 && completionPercent > 0;
  if (deployReady) {
    console.log("  ✅ DEPLOY READY — no blockers");
  } else if (summary.blocked > 0) {
    console.log("  🚫 BLOCKED — resolve blocked items before deploy");
  }
  if (completionPercent < 30) {
    console.log("  ⚠️  Early stage — manual review recommended before release");
  }

  console.log(`\n  Report saved: ${OUTPUT_PATH}\n`);
}

const report = generateReport();
display(report);
