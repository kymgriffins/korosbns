/**
 * One-time em-dash migration script.
 * Run: npx tsx scripts/migrate-em-dashes.ts --dry-run   (report only)
 * Run: npx tsx scripts/migrate-em-dashes.ts             (apply changes)
 *
 * Replaces em-dashes (—) with contextually appropriate alternatives:
 * - In JSON content files: replace with ", " (comma separator) or ". " (sentence break)
 * - In TSX/TS files: replace with " -- " (keeps markdown-compatible dash) or ", "
 *
 * After running, re-run the validator: POST /api/cms/{collection} will reject if any remain.
 */

import fs from "node:fs";
import path from "node:path";

const DRY_RUN = process.argv.includes("--dry-run");
const ROOT = process.cwd();
const EM_DASH = "\u2014";

const TARGET_DIRS = [
  "src/content",
  "src/data",
  "src/constants",
  "src/components",
  "src/lib",
  "src/utils",
  "src/app",
];

const SKIP_PATTERNS = [
  /node_modules/,
  /\.next/,
  /\.git/,
  /dist/,
];

type MigrationResult = {
  file: string;
  replacements: number;
  before: string;
  after: string;
};

function shouldSkip(filePath: string): boolean {
  return SKIP_PATTERNS.some((pat) => pat.test(filePath));
}

function getReplacement(match: string, context: string): string {
  // If em-dash is surrounded by spaces (em-dash as separator), use " -- "
  if (match.startsWith(" ") && match.endsWith(" ")) {
    return " -- ";
  }
  // If at start of quoted string after space, use comma
  if (match.startsWith(" ")) {
    return ", ";
  }
  // If at end before space, use period
  if (match.endsWith(" ")) {
    return ". ";
  }
  // Default: keep as markdown-compatible dash
  return " -- ";
}

function migrateFile(filePath: string): MigrationResult | null {
  const content = fs.readFileSync(filePath, "utf-8");
  if (!content.includes(EM_DASH)) return null;

  let replacements = 0;
  const newContent = content.replace(new RegExp(EM_DASH, "g"), (match, offset) => {
    replacements++;
    const before = content.substring(Math.max(0, offset - 20), offset);
    const after = content.substring(offset + 1, offset + 21);
    return getReplacement(match, before + after);
  });

  // In dry-run mode, do not write to disk
  if (!DRY_RUN) {
    fs.writeFileSync(filePath, newContent, "utf-8");
  }

  return {
    file: path.relative(ROOT, filePath),
    replacements,
    before: content.substring(0, 200),
    after: newContent.substring(0, 200),
  };
}

function walkDir(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (shouldSkip(fullPath)) continue;
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (/\.(json|ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  console.log(`Em-dash migration starting... ${DRY_RUN ? "(DRY RUN — no files modified)" : "(LIVE — files will be modified)"}\n`);

  let totalFiles = 0;
  let totalReplacements = 0;
  const results: MigrationResult[] = [];

  for (const dir of TARGET_DIRS) {
    const fullPath = path.join(ROOT, dir);
    if (!fs.existsSync(fullPath)) continue;

    const files = walkDir(fullPath);
    for (const file of files) {
      const result = migrateFile(file);
      if (result) {
        results.push(result);
        totalFiles++;
        totalReplacements += result.replacements;
      }
    }
  }

  console.log(`Found em-dashes in ${totalFiles} files (${totalReplacements} total replacements)\n`);

  for (const r of results) {
    console.log(`  ${r.file}: ${r.replacements} replacement(s)`);
  }

  if (results.length === 0) {
    console.log("No em-dashes found. Migration not needed.");
    return;
  }

  console.log(`\nTotal: ${totalReplacements} em-dashes across ${totalFiles} files`);
  console.log("Review the changes and commit. Then run the validator to confirm clean.");
}

main();
