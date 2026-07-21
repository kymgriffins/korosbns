/**
 * Auto-linking glossary for Learn chapter text — Moodle's glossary-autolink
 * pattern. Content is jargon-dense ("BETA," "Appropriation Act," "fiscal
 * deficit") for an audience the product promises needs no prior knowledge.
 * We wrap the FIRST occurrence of each known term in the rendered chapter
 * HTML with a dotted-underline span carrying a `data-tooltip` definition —
 * pure CSS renders the tooltip (see .glossary-term in learn-tokens.css), so
 * this works safely on server-rendered dangerouslySetInnerHTML content.
 */

export const LEARN_GLOSSARY: Record<string, string> = {
  "Appropriation Act": "The law Parliament passes to formally authorise government spending for a financial year.",
  "Cabinet Secretary": "The politically appointed head of a national government ministry — similar to a government minister.",
  "fiscal deficit": "The gap between what government spends and what it collects in revenue — the amount it must borrow to cover.",
  BETA: "Bottom-Up Economic Transformation Agenda — the government's stated policy priorities guiding budget allocations.",
  "Budget Policy Statement": "Kenya's early roadmap for the national budget — sets priorities and spending ceilings before the full estimates are published.",
  "Finance Bill": "The annual bill that proposes changes to tax law needed to fund the budget.",
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** Replaces the first occurrence of `term` found in a text node (never inside
 * an HTML tag/attribute) with a glossary-wrapped span. Stops after one hit. */
function wrapFirstOccurrence(html: string, term: string, definition: string): string {
  const re = new RegExp(`\\b(${escapeRegExp(term)})\\b`, "i");
  let used = false;
  return html.replace(/>([^<]+)</g, (full, text: string) => {
    if (used || !re.test(text)) return full;
    used = true;
    const tooltip = escapeAttribute(definition);
    const next = text.replace(
      re,
      (match) =>
        `<span class="glossary-term" tabindex="0" role="term" aria-label="${tooltip}" data-tooltip="${tooltip}">${match}</span>`,
    );
    return `>${next}<`;
  });
}

/** Apply the glossary to a rendered chapter HTML string. Safe to call on
 * already-sanitized HTML — inserted spans carry only static, developer-
 * authored definition text (no user input). */
export function applyLearnGlossary(
  html: string,
  dictionary: Record<string, string> = LEARN_GLOSSARY,
): string {
  if (!html) return html;
  let next = html;
  for (const [term, definition] of Object.entries(dictionary)) {
    next = wrapFirstOccurrence(next, term, definition);
  }
  return next;
}
