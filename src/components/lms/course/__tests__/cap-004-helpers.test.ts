/**
 * @sdp-provenance
 * capability: CAP-course-detail
 * spec_id: LJP-004
 * contracts: sic-cap-004@1.0.0
 */
import { describe, expect, it } from "vitest";
import {
  formatJourneyTime,
  resolveDefaultOpenModule,
  resolveLearningOutcomes,
} from "@/components/lms/course/format-journey-time";

describe("CAP-004 journey helpers", () => {
  it("formats estimated time per SIC-CAP-004", () => {
    expect(formatJourneyTime(45)).toBe("45 min");
    expect(formatJourneyTime(60)).toBe("~1h");
    expect(formatJourneyTime(95)).toBe("~1h 35m");
  });

  it("prefers learningOutcomes and caps at 4", () => {
    const outcomes = resolveLearningOutcomes({
      learningOutcomes: ["a", "b", "c", "d", "e"],
      modules: [{ objectives: ["x"] }],
    });
    expect(outcomes).toEqual(["a", "b", "c", "d"]);
  });

  it("falls back to unique module objectives", () => {
    const outcomes = resolveLearningOutcomes({
      modules: [
        { objectives: ["One", "Two"] },
        { objectives: ["Two", "Three"] },
      ],
    });
    expect(outcomes).toEqual(["One", "Two", "Three"]);
  });

  it("hides outcomes when none exist", () => {
    expect(resolveLearningOutcomes({ modules: [{ objectives: [] }] })).toEqual([]);
  });

  it("auto-opens exactly one in_progress module", () => {
    expect(
      resolveDefaultOpenModule([
        { slug: "a", status: "completed" },
        { slug: "b", status: "in_progress" },
        { slug: "c", status: "available" },
      ]),
    ).toBe("b");
  });

  it("keeps all collapsed when zero or many in_progress", () => {
    expect(
      resolveDefaultOpenModule([
        { slug: "a", status: "available" },
        { slug: "b", status: "available" },
      ]),
    ).toBeUndefined();
    expect(
      resolveDefaultOpenModule([
        { slug: "a", status: "in_progress" },
        { slug: "b", status: "in_progress" },
      ]),
    ).toBeUndefined();
  });
});
