/**
 * CMS Validators — Section 11 audit gates.
 * Wired into POST /api/cms/[collection] to block publish on fail.
 */

export type ValidatorResult = {
  rule: string;
  pass: boolean;
  message: string;
  count?: number;
  limit?: number;
};

export type PageValidationResult = {
  collection: string;
  timestamp: string;
  passed: boolean;
  results: ValidatorResult[];
};

// --- Em-dash checker ---

const EM_DASH_REGEX = /[\u2014]/g;

export function checkEmDash(text: string): ValidatorResult {
  const matches = text.match(EM_DASH_REGEX);
  const count = matches ? matches.length : 0;
  return {
    rule: "em-dash-ban",
    pass: count === 0,
    message: count === 0
      ? "No em-dashes found"
      : `Found ${count} em-dash(es). Replace with a comma, period, or dash.`,
    count,
    limit: 0,
  };
}

// --- Hero headline line count ---

export function checkHeroHeadline(text: string): ValidatorResult {
  const lines = text.split(/\n/).filter((l) => l.trim().length > 0);
  const lineCount = lines.length;
  return {
    rule: "hero-headline-lines",
    pass: lineCount <= 2,
    message: `Headline spans ${lineCount} line(s). Max 2.`,
    count: lineCount,
    limit: 2,
  };
}

// --- Hero subtext word count ---

export function checkHeroSubtext(text: string): ValidatorResult {
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  return {
    rule: "hero-subtext-words",
    pass: wordCount <= 20,
    message: `Subtext is ${wordCount} words. Max 20.`,
    count: wordCount,
    limit: 20,
  };
}

// --- CTA above fold ---

export function checkCtaAboveFold(page: Record<string, unknown>): ValidatorResult {
  const hero = page.hero as Record<string, unknown> | undefined;
  const primaryCta = hero?.primaryCta as Record<string, string> | undefined;
  const landingHero = page as Record<string, unknown>;
  const cta = primaryCta || (landingHero.primaryCta as Record<string, string> | undefined);
  const hasCta = Boolean(cta?.label && cta?.href);
  return {
    rule: "cta-above-fold",
    pass: hasCta,
    message: hasCta
      ? "Hero has a primary CTA"
      : "Hero is missing a primaryCta with label and href. CTA must be above the fold.",
  };
}

// --- Nav height / count ---

export function checkNavHeight(navLinks: unknown[]): ValidatorResult {
  const count = Array.isArray(navLinks) ? navLinks.length : 0;
  return {
    rule: "nav-item-count",
    pass: count <= 6,
    message: `${count} nav items. Max 6 for single-line desktop fit at 1024px.`,
    count,
    limit: 6,
  };
}

// --- Bento N=N ---

export function checkBento(block: Record<string, unknown>): ValidatorResult {
  const items = block.items as unknown[] | undefined;
  const cells = block.cells as unknown[] | undefined;
  if (!items || !cells) {
    return {
      rule: "bento-n-equals-n",
      pass: true,
      message: "No bento block to validate.",
    };
  }
  const nItems = items.length;
  const nCells = cells.length;
  const hasEmpty = items.some(
    (item) => item === null || item === undefined || (typeof item === "string" && item.trim() === ""),
  );
  return {
    rule: "bento-n-equals-n",
    pass: nItems === nCells && !hasEmpty,
    message:
      nItems === nCells && !hasEmpty
        ? `Bento: ${nItems} items match ${nCells} cells, no empty cells`
        : `Bento mismatch: ${nItems} items vs ${nCells} cells${hasEmpty ? ", has empty cells" : ""}`,
    count: nItems,
    limit: nCells,
  };
}

// --- Single theme per page ---

export function checkSingleTheme(page: Record<string, unknown>): ValidatorResult {
  const themeCount = Number(page._themeCount || 0);
  if (themeCount === 0) {
    return {
      rule: "single-theme",
      pass: true,
      message: "No mid-page theme switches detected.",
    };
  }
  return {
    rule: "single-theme",
    pass: false,
    message: `Page has ${themeCount} theme switch(es). Only one themeMode per page allowed.`,
    count: themeCount,
    limit: 1,
  };
}

// --- Real images only ---

export function checkRealImages(page: Record<string, unknown>): ValidatorResult {
  const fakePatterns = [
    /div[- ]based[- ]screenshot/i,
    /placeholder[- ]image/i,
    /fake[- ]screenshot/i,
    /hand[- ]drawn[- ]svg/i,
    /icon[- ]set/i,
  ];
  const issues: string[] = [];

  function walk(obj: unknown, path: string) {
    if (typeof obj === "string") {
      for (const pat of fakePatterns) {
        if (pat.test(obj)) {
          issues.push(`${path}: "${obj.slice(0, 60)}" matches fake pattern`);
        }
      }
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => walk(item, `${path}[${i}]`));
    }
    if (obj && typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) {
        walk(v, path ? `${path}.${k}` : k);
      }
    }
  }

  walk(page, "page");

  return {
    rule: "real-images-only",
    pass: issues.length === 0,
    message:
      issues.length === 0
        ? "No fake images detected"
        : `Found ${issues.length} potential fake image(s): ${issues.slice(0, 3).join("; ")}`,
    count: issues.length,
    limit: 0,
  };
}

// --- Forbidden patterns ---

const FORBIDDEN_PATTERNS = [
  { regex: /^\d+\s*[—\-]\s*/m, name: "section-numbering eyebrow" },
  { regex: /v\d+\.\d+\s*(release|update|version)/i, name: "version label" },
  { regex: /scroll\s*(down|to|more)/i, name: "scroll cue" },
  { regex: /locale[- ]?strip/i, name: "locale strip" },
  { regex: /decorative[- ]status[- ]dot/i, name: "decorative status dot" },
];

export function checkForbiddenPatterns(text: string): ValidatorResult {
  const found: string[] = [];
  for (const { regex, name } of FORBIDDEN_PATTERNS) {
    if (regex.test(text)) {
      found.push(name);
    }
  }
  return {
    rule: "forbidden-patterns",
    pass: found.length === 0,
    message:
      found.length === 0
        ? "No forbidden patterns found"
        : `Found forbidden patterns: ${found.join(", ")}`,
    count: found.length,
    limit: 0,
  };
}

// --- Motion coupling ---

export function checkMotionCoupling(page: Record<string, unknown>): ValidatorResult {
  const dials = page.dials as Record<string, number> | undefined;
  if (!dials || dials.MOTION_INTENSITY === undefined) {
    return {
      rule: "motion-coupling",
      pass: true,
      message: "No MOTION_INTENSITY dial set.",
    };
  }
  const intensity = dials.MOTION_INTENSITY;
  if (intensity <= 4) {
    return {
      rule: "motion-coupling",
      pass: true,
      message: `MOTION_INTENSITY=${intensity}. No animation config required.`,
    };
  }
  const hasAnim = Boolean(
    page.animationConfig || page.scrollAnimations || page.motionConfig,
  );
  return {
    rule: "motion-coupling",
    pass: hasAnim,
    message: hasAnim
      ? `MOTION_INTENSITY=${intensity} with animation config present`
      : `MOTION_INTENSITY=${intensity} but no animationConfig/scrollAnimations/motionConfig found. Either add animation config or drop the dial.`,
  };
}

// --- Text rating (computed at save) ---

export function computeTextRating(text: string, context?: {
  expectedLength?: number;
  isFirstUse?: boolean;
  knownAcronyms?: string[];
}): {
  voiceFidelity: number;
  clarity: number;
  lengthCompliance: number;
  emDashCount: number;
  jargonLoad: number;
  civicSpecificity: number;
  readingLevel: number;
  total: number;
  band: "ship" | "ship-with-note" | "revise" | "block";
} {
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);

  // Em-dash count (inverted: 0 = 5, 1 = 3, 2+ = 1)
  const emDashes = (text.match(EM_DASH_REGEX) || []).length;
  const emDashScore = emDashes === 0 ? 5 : emDashes === 1 ? 3 : 1;

  // Clarity: short sentences = good
  const clarityScore = avgWordsPerSentence <= 15 ? 5 : avgWordsPerSentence <= 20 ? 4 : avgWordsPerSentence <= 25 ? 3 : 2;

  // Length compliance
  const expected = context?.expectedLength || 40;
  const lengthRatio = words.length / expected;
  const lengthScore = lengthRatio <= 1 ? 5 : lengthRatio <= 1.2 ? 4 : lengthRatio <= 1.5 ? 3 : 1;

  // Jargon: check for uppercase acronyms
  const acronymMatches = text.match(/\b[A-Z]{2,}\b/g) || [];
  const jargonScore = acronymMatches.length <= 1 ? 5 : acronymMatches.length <= 3 ? 4 : acronymMatches.length <= 5 ? 3 : 2;

  // Civic specificity: check for numbers, county names, KSh, institutions
  const specificityMarkers = (text.match(/KSh|KES|county|Article|Section|Act|Treasury|KRA|CRA|CoB|Kenya/gi) || []).length;
  const specificityScore = specificityMarkers >= 3 ? 5 : specificityMarkers >= 2 ? 4 : specificityMarkers >= 1 ? 3 : 2;

  // Reading level: Flesch-Kincaid approximation (short words = easier)
  const longWords = words.filter((w) => w.length > 6).length;
  const longWordRatio = longWords / Math.max(words.length, 1);
  const readingScore = longWordRatio <= 0.2 ? 5 : longWordRatio <= 0.3 ? 4 : longWordRatio <= 0.4 ? 3 : 2;

  // Voice fidelity (heuristic: direct address, civic vocabulary)
  const voiceMarkers = (text.match(/we|you|your|kenya|citizen|mwananchi|budget|public money/gi) || []).length;
  const voiceScore = voiceMarkers >= 3 ? 5 : voiceMarkers >= 2 ? 4 : voiceMarkers >= 1 ? 3 : 2;

  const total = Math.round(
    voiceScore * 20 +
    clarityScore * 20 +
    lengthScore * 15 +
    emDashScore * 10 +
    jargonScore * 10 +
    specificityScore * 15 +
    readingScore * 10
  );

  const band =
    total >= 90 ? "ship" :
    total >= 75 ? "ship-with-note" :
    total >= 60 ? "revise" :
    "block";

  return {
    voiceFidelity: voiceScore,
    clarity: clarityScore,
    lengthCompliance: lengthScore,
    emDashCount: emDashScore,
    jargonLoad: jargonScore,
    civicSpecificity: specificityScore,
    readingLevel: readingScore,
    total,
    band,
  };
}

// --- Run all validators on a collection ---

export function validateCollection(
  slug: string,
  data: Record<string, unknown>,
): PageValidationResult {
  const results: ValidatorResult[] = [];

  // Walk all text fields for em-dashes and forbidden patterns
  function walkText(obj: unknown, path: string) {
    if (typeof obj === "string") {
      results.push(checkEmDash(obj));
      if (path.includes("eyebrow") || path.includes("title") || path.includes("heading")) {
        results.push(checkForbiddenPatterns(obj));
      }
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => walkText(item, `${path}[${i}]`));
    }
    if (obj && typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) {
        walkText(v, path ? `${path}.${k}` : k);
      }
    }
  }

  walkText(data, slug);

  // Page-level validators
  if (data.navLinks) {
    results.push(checkNavHeight(data.navLinks as unknown[]));
  }

  if (data.hero || data.primaryCta) {
    results.push(checkCtaAboveFold(data));
  }

  if (data.items && data.cells) {
    results.push(checkBento(data as Record<string, unknown>));
  }

  if (data.dials) {
    results.push(checkMotionCoupling(data));
  }

  results.push(checkRealImages(data));

  const passed = results.every((r) => r.pass);

  return {
    collection: slug,
    timestamp: new Date().toISOString(),
    passed,
    results,
  };
}

/**
 * checkLockedFields — blocks edits to locked fields.
 * Returns array of paths that are locked and would be modified.
 */
export function checkLockedFields(
  existing: Record<string, unknown>,
  incoming: Record<string, unknown>,
): string[] {
  const lockedPaths: string[] = [];

  function walk(
    objA: Record<string, unknown>,
    objB: Record<string, unknown>,
    prefix: string,
  ) {
    for (const key of Object.keys(objB)) {
      const path = prefix ? `${prefix}.${key}` : key;
      const valA = objA[key];
      const valB = objB[key];

      if (
        valA &&
        typeof valA === "object" &&
        !Array.isArray(valA) &&
        "locked" in (valA as Record<string, unknown>) &&
        (valA as Record<string, unknown>).locked === true
      ) {
        lockedPaths.push(path);
        continue;
      }

      if (
        valA &&
        typeof valA === "object" &&
        !Array.isArray(valA) &&
        valB &&
        typeof valB === "object" &&
        !Array.isArray(valB)
      ) {
        walk(
          valA as Record<string, unknown>,
          valB as Record<string, unknown>,
          path,
        );
      }
    }
  }

  walk(existing, incoming, "");
  return lockedPaths;
}
