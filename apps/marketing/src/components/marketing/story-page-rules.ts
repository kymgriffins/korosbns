export const STORY_PAGE_RULES = {
  maxWordsPerCard: 45,
  targetLinesPerCard: 6,
  maxCharactersPerLine: 42,
} as const;

export const MEET_BETA_EXAMPLE_COPY =
  "BETA = Bottom-Up Economic Transformation Agenda. That's government speak for 'let's grow Kenya from the ground up!'";

export function estimateLineCount(text: string, maxCharsPerLine: number): number {
  if (!text.trim()) return 0;
  return Math.ceil(text.trim().length / maxCharsPerLine);
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
