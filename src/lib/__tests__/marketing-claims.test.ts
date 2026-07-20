import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/** Phrases that overclaim product capability — must not appear in marketing/project copy. */
const FORBIDDEN = [
  /5 million young Kenyans across all 47 counties/i,
  /real-time county allocations/i,
  /Hyper-local budget analysis for all 47 counties/i,
  /Launched Kiswahili-translated modules/i,
  /Launched Kiswahili and Sheng content tracks/i,
];

function walkTsx(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walkTsx(p, out);
    } else if (/\.(tsx|ts)$/.test(name)) {
      out.push(p);
    }
  }
  return out;
}

describe("Marketing claim honesty (P2)", () => {
  it("forbids known overclaim phrases in marketing and project surfaces", () => {
    const roots = [
      join(process.cwd(), "src/components/marketing"),
      join(process.cwd(), "src/components/project"),
    ];
    const files = roots.flatMap((r) => walkTsx(r));
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const re of FORBIDDEN) {
        if (re.test(text)) hits.push(`${file}: ${re}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
